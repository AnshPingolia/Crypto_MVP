"""
classifier.py — Isshan's module.

Four-tier evidence hierarchy (strongest-first fallback chain):
  Tier 1: Known label match         → EvidenceLevel.strong
  Tier 2: Relationship evidence     → EvidenceLevel.moderate / weak
  Tier 3: Behavioral evidence       → EvidenceLevel.weak / moderate
  Tier 4: Unresolved                → EvidenceLevel.unresolved

Design constraints (from the spec, locked):
  • Deterministic — no ML, no randomness.  Same input → same output.
  • All reasoning strings are built from real computed facts.
  • Conflicting signals are never silently dropped; they go into
    contradicting_evidence.
  • EvidenceLevel is NEVER a number or percentage.
"""

import json
from pathlib import Path
from typing import Optional

from models import EvidenceLevel, Finding, TraceGraph, TraceGraphNode

# ── Constants ─────────────────────────────────────────────────────────────────
LABELS_PATH = Path(__file__).parent / "known_labels.json"

# ≥ this many distinct senders → "consolidation / exchange deposit" pattern
CONSOLIDATION_SENDER_THRESHOLD = 10
# ≥ this many edges to a labeled neighbour → moderate (else weak) relationship
RELATIONSHIP_EDGE_THRESHOLD = 3


# ── Label loader ──────────────────────────────────────────────────────────────

def _load_labels() -> dict:
    """
    Parse known_labels.json and return a dict keyed by address.
    Format expected: [{"address": ..., "category": ..., "source": ...}, ...]
    """
    with open(LABELS_PATH, encoding="utf-8") as fh:
        raw: list = json.load(fh)
    return {entry["address"]: entry for entry in raw}


# ── Main classifier ───────────────────────────────────────────────────────────

def classify_leaf(node: TraceGraphNode, graph: TraceGraph) -> Finding:
    """
    Classify a single graph node using the four-tier evidence hierarchy.
    Only information already in `graph` and `known_labels.json` is used.

    Parameters
    ----------
    node  : TraceGraphNode to classify (carries address and hop_distance)
    graph : the full TraceGraph (needed for edge-level relationship checks)

    Returns
    -------
    Finding — always, for every node passed in.
    """
    labels = _load_labels()
    address = node.address

    # ── Tier 1: Known label match ─────────────────────────────────────────────
    if address in labels:
        entry = labels[address]
        return Finding(
            address=address,
            category=entry["category"],
            evidence_level=EvidenceLevel.strong,
            reasoning=(
                f"Address matched known label '{entry['category']}' "
                f"(source: {entry['source']})."
            ),
            contradicting_evidence=None,
        )

    # ── Tier 2: Relationship evidence ─────────────────────────────────────────
    # Direct neighbours (one hop in either direction) that ARE in the label set
    neighbors_in  = {e.from_address for e in graph.edges if e.to_address   == address}
    neighbors_out = {e.to_address   for e in graph.edges if e.from_address == address}
    all_neighbors = neighbors_in | neighbors_out

    labeled_neighbors = {n: labels[n] for n in all_neighbors if n in labels}

    if labeled_neighbors:
        # Pick the "best" neighbour deterministically: alphabetical order of address
        best_neighbor = min(labeled_neighbors.keys())
        entry = labeled_neighbors[best_neighbor]
        # Count edges between this node and the best labeled neighbour
        edge_count = sum(
            1 for e in graph.edges
            if (e.from_address == address and e.to_address   == best_neighbor)
            or (e.from_address == best_neighbor and e.to_address == address)
        )
        level = (
            EvidenceLevel.moderate
            if edge_count >= RELATIONSHIP_EDGE_THRESHOLD
            else EvidenceLevel.weak
        )
        return Finding(
            address=address,
            category=f"connected to {entry['category']}",
            evidence_level=level,
            reasoning=(
                f"Address has {edge_count} direct transaction(s) with "
                f"{best_neighbor}, a known '{entry['category']}' "
                f"(source: {entry['source']})."
            ),
            contradicting_evidence=None,
        )

    # ── Tier 3: Behavioral evidence ───────────────────────────────────────────
    distinct_senders   = {e.from_address for e in graph.edges if e.to_address   == address}
    distinct_receivers = {e.to_address   for e in graph.edges if e.from_address == address}
    sender_count   = len(distinct_senders)
    receiver_count = len(distinct_receivers)

    behavioral_signals: list[str] = []
    contradicting_signals: list[str] = []

    if sender_count >= CONSOLIDATION_SENDER_THRESHOLD:
        behavioral_signals.append(
            f"{sender_count} distinct sender(s) → possible consolidation / exchange deposit pattern"
        )
    if receiver_count >= CONSOLIDATION_SENDER_THRESHOLD:
        behavioral_signals.append(
            f"{receiver_count} distinct receiver(s) → possible distribution / exchange withdrawal pattern"
        )

    if behavioral_signals:
        # High in-degree AND high out-degree simultaneously → could be exchange OR mixer
        if (
            sender_count   >= CONSOLIDATION_SENDER_THRESHOLD
            and receiver_count >= CONSOLIDATION_SENDER_THRESHOLD
        ):
            level = EvidenceLevel.moderate
            contradicting_signals.append(
                f"High in-degree ({sender_count}) AND high out-degree ({receiver_count}) detected — "
                "pattern is consistent with both an exchange hot wallet and a mixing service; "
                "cannot rule out either interpretation without further manual review."
            )
        else:
            level = EvidenceLevel.weak

        return Finding(
            address=address,
            category="unidentified — behavioral pattern detected",
            evidence_level=level,
            reasoning=(
                "; ".join(behavioral_signals)
                + f" (node at hop {node.hop_distance} from origin wallet)."
            ),
            contradicting_evidence=(
                "; ".join(contradicting_signals) if contradicting_signals else None
            ),
        )

    # ── Tier 4: Unresolved ────────────────────────────────────────────────────
    return Finding(
        address=address,
        category="unidentified",
        evidence_level=EvidenceLevel.unresolved,
        reasoning=(
            f"No label match, no labeled direct neighbours, and no behavioral pattern "
            f"detected. Node is at hop {node.hop_distance} from origin; "
            f"{sender_count} distinct sender(s) and {receiver_count} distinct receiver(s) "
            f"in the visible graph."
        ),
        contradicting_evidence=None,
    )
