"""
tracer.py — Parth's module.

Bounded breadth-first-search (BFS) over a directed transfer graph built
from NormalizedTransaction objects.

Design constraints (from the spec, locked):
  • Deterministic: same input → identical output, every time.
  • No ML, no randomness, no external calls.
  • networkx DiGraph for graph operations.
  • MAX_HOPS = 4 (configurable).
  • TRACE_WINDOW_DAYS = 90 (configurable; overridable via env var).
  • Breakpoints recorded for every halted frontier node.
"""

import os
from collections import deque
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import networkx as nx

from models import (
    Breakpoint,
    BreakpointReason,
    NormalizedTransaction,
    TraceGraph,
    TraceGraphEdge,
    TraceGraphNode,
)

MAX_HOPS = int(os.environ.get("MAX_HOPS", 4))
TRACE_WINDOW_DAYS = int(os.environ.get("TRACE_WINDOW_DAYS", 90))


def trace_graph(
    case_id: str,
    origin: str,
    transfers: List[NormalizedTransaction],
    max_hops: int = MAX_HOPS,
    window_days: int = TRACE_WINDOW_DAYS,
    anchor: Optional[datetime] = None,
) -> TraceGraph:
    """
    Build a bounded BFS trace graph starting from `origin`.

    Algorithm
    ---------
    1.  Determine the time window. `anchor` is the moment the case was
        opened (Case.incident_reported_at); if not given, anchor = now (UTC).
        Window = [anchor - window_days, anchor + window_days] -- looking back
        because the theft happened BEFORE the case was reported, and forward
        because funds may keep moving afterwards. The anchor is never derived
        from the wallet's own transfer history: old, unrelated transfers
        (spam/dust) must not be able to move the window.
    2.  Load all transfers into a networkx DiGraph.
        Nodes = wallet addresses; edges carry {amount, hash, time}.
    3.  BFS from origin (hop 0).  At each node, before expanding, check:
          a. hop >= max_hops        → Breakpoint(max_hops),   stop expanding.
          b. no outgoing edges      → Breakpoint(no_outgoing), stop.
          c. all outgoing edges are outside the time window
                                   → Breakpoint(window_exceeded), stop.
        Otherwise enqueue unvisited neighbours at hop+1.
    4.  Emit only edges whose both endpoints are in the visited set.

    Returns
    -------
    TraceGraph with case_id, nodes (each carrying hop_distance), edges,
    and breakpoints.
    """
    # ── 1. Time window ───────────────────────────────────────────────────
    if anchor is None:
        anchor = datetime.now(timezone.utc)
    elif anchor.tzinfo is None:
        anchor = anchor.replace(tzinfo=timezone.utc)   # SQLite drops tzinfo
    window_start: datetime = anchor - timedelta(days=window_days)
    window_end: datetime = anchor + timedelta(days=window_days)

    # ── 2. Build networkx DiGraph ─────────────────────────────────────────
    G: nx.DiGraph = nx.DiGraph()
    for tx in transfers:
        # Multiple transfers between the same pair accumulate as parallel
        # edges; networkx DiGraph keeps only one edge per (u, v) pair, so
        # we store a list of transfer metadata keyed by hash.
        if G.has_edge(tx.from_address, tx.to_address):
            G[tx.from_address][tx.to_address]["txs"].append(tx)
        else:
            G.add_edge(tx.from_address, tx.to_address, txs=[tx])

    # ── 3. BFS ────────────────────────────────────────────────────────────
    visited: dict[str, int] = {}   # address → hop_distance
    breakpoints: List[Breakpoint] = []
    queue: deque[tuple[str, int]] = deque()

    visited[origin] = 0
    queue.append((origin, 0))

    while queue:
        node, hop = queue.popleft()

        # (a) Hop-cap check — node reached at this hop cannot be expanded
        if hop >= max_hops:
            breakpoints.append(Breakpoint(address=node, reason=BreakpointReason.max_hops))
            continue

        # (b) No outgoing edges at all
        if node not in G or G.out_degree(node) == 0:
            breakpoints.append(Breakpoint(address=node, reason=BreakpointReason.no_outgoing))
            continue

        # Collect outgoing transfers that fall inside the time window
        # [window_start, window_end]; anything outside is excluded.
        in_window_neighbors: List[str] = []
        for _, neighbour, data in G.out_edges(node, data=True):
            txs_in_window = [
                tx for tx in data["txs"]
                if window_start <= tx.time <= window_end
            ]
            if txs_in_window:
                in_window_neighbors.append(neighbour)

        # (c) All outgoing transfers are outside the window
        if not in_window_neighbors:
            breakpoints.append(Breakpoint(address=node, reason=BreakpointReason.window_exceeded))
            continue

        # Enqueue unvisited neighbours
        for neighbour in in_window_neighbors:
            if neighbour not in visited:
                visited[neighbour] = hop + 1
                queue.append((neighbour, hop + 1))

    # ── 4. Build schema objects ───────────────────────────────────────────
    nodes: List[TraceGraphNode] = [
        TraceGraphNode(address=addr, hop_distance=dist)
        for addr, dist in visited.items()
    ]

    visited_set = set(visited.keys())
    edges: List[TraceGraphEdge] = []
    seen_hashes: set[str] = set()   # deduplicate: one edge object per tx hash
    for tx in transfers:
        if (
            tx.from_address in visited_set
            and tx.to_address in visited_set
            and tx.hash not in seen_hashes
        ):
            edges.append(
                TraceGraphEdge(
                    from_address=tx.from_address,
                    to_address=tx.to_address,
                    amount=tx.amount,
                    hash=tx.hash,
                )
            )
            seen_hashes.add(tx.hash)

    return TraceGraph(
        case_id=case_id,
        nodes=nodes,
        edges=edges,
        breakpoints=breakpoints,
    )