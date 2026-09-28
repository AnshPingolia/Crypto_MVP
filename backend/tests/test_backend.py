"""
tests/test_backend.py — pytest suite for tracer.py and classifier.py.

All tests use hand-built fake data — zero live TronGrid calls.
The four required cases (per spec section 5):
  1. Trace that hits max_hops breakpoint.
  2. Trace that hits no_outgoing breakpoint.
  3. Classify a leaf whose address is in known_labels.json → Strong.
  4. Classify a leaf that matches nothing → Unresolved.

Additional tests:
  5. window_exceeded breakpoint.
  6. Relationship evidence (Moderate) when neighbor is labeled.
  7. report_hash is reproducible (same input → same hash).
  8. normalize() maps raw TronGrid dict correctly.
"""

import json
import tempfile
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from pathlib import Path
from typing import List
from unittest.mock import patch

import pytest

from models import (
    Breakpoint,
    BreakpointReason,
    EvidenceLevel,
    NormalizedTransaction,
    TraceGraph,
    TraceGraphEdge,
    TraceGraphNode,
)
from tracer import trace_graph
from classifier import classify_leaf, LABELS_PATH
from reporter import build_report
from fetch import normalize


# ── Helpers ───────────────────────────────────────────────────────────────────

ORIGIN = "TORIGIN000000000000000000000000000"

def _now() -> datetime:
    return datetime.now(timezone.utc)


def _tx(from_: str, to_: str, *, days_ago: float = 0, amount: str = "1000000") -> NormalizedTransaction:
    """Build a fake NormalizedTransaction."""
    return NormalizedTransaction(
        hash=f"hash_{from_}_{to_}_{days_ago}",
        from_address=from_,
        to_address=to_,
        amount=Decimal(amount) / Decimal(10 ** 6),
        asset="USDT",
        asset_contract="TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
        time=_now() - timedelta(days=days_ago),
        raw_value=amount,
        decimals=6,
    )


def _make_graph(case_id: str, txs: List[NormalizedTransaction], **kwargs) -> TraceGraph:
    """Convenience wrapper around trace_graph."""
    return trace_graph(case_id=case_id, origin=ORIGIN, transfers=txs, **kwargs)


# ── Test 1: max_hops breakpoint ───────────────────────────────────────────────

def test_max_hops_breakpoint():
    """
    A chain ORIGIN → A → B → C → D → E with max_hops=4.
    D is at hop 4, so it must be breakpointed as max_hops, not visited further.
    E must NOT appear in the graph nodes.
    """
    A, B, C, D, E = "TA", "TB", "TC", "TD", "TE"
    txs = [
        _tx(ORIGIN, A),
        _tx(A, B),
        _tx(B, C),
        _tx(C, D),
        _tx(D, E),   # hop 5 — must never be reached
    ]
    graph = _make_graph("case-maxhops", txs, max_hops=4)

    node_addresses = {n.address for n in graph.nodes}
    bp_addresses = {bp.address for bp in graph.breakpoints}
    bp_reasons = {bp.address: bp.reason for bp in graph.breakpoints}

    assert E not in node_addresses, "Hop-5 node must not be in the graph."
    assert D in bp_addresses, "D (at hop 4) must be breakpointed."
    assert bp_reasons[D] == BreakpointReason.max_hops


# ── Test 2: no_outgoing breakpoint ────────────────────────────────────────────

def test_no_outgoing_breakpoint():
    """
    ORIGIN → A with no further transfers from A.
    A should receive a no_outgoing breakpoint.
    """
    A = "TA_LEAF"
    txs = [_tx(ORIGIN, A)]
    graph = _make_graph("case-noop", txs)

    bp_map = {bp.address: bp.reason for bp in graph.breakpoints}
    assert A in bp_map, "Leaf node A must be breakpointed."
    assert bp_map[A] == BreakpointReason.no_outgoing


# ── Test 3: window_exceeded breakpoint ───────────────────────────────────────

def test_window_exceeded_breakpoint():
    """
    ORIGIN → A (1 day ago) → B (200 days ago).
    With window_days=90, B's only outgoing path is outside the window.
    A should be breakpointed as window_exceeded.
    """
    A, B = "TA_WIN", "TB_WIN"
    txs = [
        _tx(ORIGIN, A, days_ago=1),
        _tx(A, B, days_ago=200),   # outside 90-day window
    ]
    graph = _make_graph("case-window", txs, window_days=90)

    bp_map = {bp.address: bp.reason for bp in graph.breakpoints}
    assert A in bp_map
    assert bp_map[A] == BreakpointReason.window_exceeded
    node_addrs = {n.address for n in graph.nodes}
    assert B not in node_addrs, "B is outside the window and must not appear."


# ── Test 4: classify → Strong (known label match) ─────────────────────────────

def test_classify_strong_known_label(tmp_path):
    """
    If a node's address is in known_labels.json, the Finding must be Strong.
    """
    known_addr = "TKNOWN_EXCHANGE_ADDR_0000000000000"
    labels = [
        {
            "address": known_addr,
            "category": "known exchange",
            "label": "Test Exchange",
            "source": "https://tronscan.org/#/address/" + known_addr,
        }
    ]
    label_file = tmp_path / "known_labels.json"
    label_file.write_text(json.dumps(labels), encoding="utf-8")

    node = TraceGraphNode(address=known_addr, hop_distance=1)
    graph = TraceGraph(case_id="case-strong", nodes=[node], edges=[], breakpoints=[])

    with patch("classifier.LABELS_PATH", label_file):
        finding = classify_leaf(node, graph)

    assert finding.evidence_level == EvidenceLevel.strong
    assert finding.category == "known exchange"
    assert known_addr in finding.reasoning


# ── Test 5: classify → Unresolved (no match anywhere) ────────────────────────

def test_classify_unresolved_no_match(tmp_path):
    """
    An address absent from labels, with no neighbors and no behavioral signals,
    must produce EvidenceLevel.unresolved.
    """
    unknown_addr = "TUNKNOWN_ADDR_00000000000000000000"
    label_file = tmp_path / "known_labels.json"
    label_file.write_text("[]", encoding="utf-8")

    node = TraceGraphNode(address=unknown_addr, hop_distance=2)
    graph = TraceGraph(case_id="case-unresolved", nodes=[node], edges=[], breakpoints=[])

    with patch("classifier.LABELS_PATH", label_file):
        finding = classify_leaf(node, graph)

    assert finding.evidence_level == EvidenceLevel.unresolved
    assert finding.category == "unidentified"
    assert finding.contradicting_evidence is None


# ── Test 6: classify → Moderate (labeled neighbour, ≥3 edges) ────────────────

def test_classify_moderate_relationship(tmp_path):
    """
    Node A is not labeled, but its neighbor B is.
    With 3 edges between A and B, the result should be Moderate.
    """
    A = "TA_RELATE"
    B = "TB_LABELED"
    labels = [
        {
            "address": B,
            "category": "known exchange",
            "label": "Test Exchange",
            "source": "https://example.com",
        }
    ]
    label_file = tmp_path / "known_labels.json"
    label_file.write_text(json.dumps(labels), encoding="utf-8")

    node_a = TraceGraphNode(address=A, hop_distance=1)
    node_b = TraceGraphNode(address=B, hop_distance=2)
    edges = [
        TraceGraphEdge(from_address=A, to_address=B, amount=Decimal("1.0"), hash=f"h{i}")
        for i in range(3)
    ]
    graph = TraceGraph(
        case_id="case-relation",
        nodes=[node_a, node_b],
        edges=edges,
        breakpoints=[],
    )

    with patch("classifier.LABELS_PATH", label_file):
        finding = classify_leaf(node_a, graph)

    assert finding.evidence_level == EvidenceLevel.moderate
    assert "known exchange" in finding.category


# ── Test 7: report_hash is reproducible ───────────────────────────────────────

def test_report_hash_reproducible():
    """
    build_report called twice with identical inputs (same sealed_at via mock)
    must produce the same report_hash.
    """
    fixed_time = datetime(2025, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
    graph = TraceGraph(case_id="case-hash", nodes=[], edges=[], breakpoints=[])

    with patch("reporter.datetime") as mock_dt:
        mock_dt.now.return_value = fixed_time
        r1 = build_report("case-hash", graph, [])

    with patch("reporter.datetime") as mock_dt:
        mock_dt.now.return_value = fixed_time
        r2 = build_report("case-hash", graph, [])

    assert r1.report_hash == r2.report_hash
    assert len(r1.report_hash) == 64   # SHA256 hex = 64 chars


# ── Test 8: normalize() maps raw TronGrid dict correctly ─────────────────────

def test_normalize_fields():
    """
    Given the exact shape from test_output.json, normalize() must map every
    field correctly (especially amount = value / 10**decimals).
    """
    raw = {
        "transaction_id": "abc123",
        "token_info": {
            "symbol": "USDT",
            "address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
            "decimals": 6,
            "name": "Tether USD",
        },
        "block_timestamp": 1785406890000,
        "from": "TSENDER000000000000000000000000000",
        "to": "TRECEIVER00000000000000000000000000",
        "type": "Transfer",
        "value": "1000000",
    }
    tx = normalize(raw)
    assert tx.hash == "abc123"
    assert tx.from_address == "TSENDER000000000000000000000000000"
    assert tx.to_address == "TRECEIVER00000000000000000000000000"
    assert tx.amount == Decimal("1.000000")
    assert tx.asset == "USDT"
    assert tx.asset_contract == "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
    assert tx.raw_value == "1000000"
    assert tx.decimals == 6
    assert tx.time.tzinfo is not None   # must be timezone-aware
    assert tx.time == datetime.fromtimestamp(1785406890000 / 1000, tz=timezone.utc)


# ── Regression test: stale unrelated transfer must not poison the anchor ─────

def test_stale_incoming_transfer_does_not_poison_window_anchor():
    """
    Regression test for a real bug: an old, unrelated incoming transfer
    (e.g. spam/dust, same shape as the SEED token seen in real TronGrid
    data) must not push the window anchor back far enough to make TODAY's
    genuine theft transfer look 'outside the window'.

    ORIGIN receives an old dust transfer ~4 years ago, then genuinely sends
    funds to A today. A must be visited at hop 1 -- the trace must not die
    at hop 0 with a false window_exceeded breakpoint.
    """
    DUST_SENDER = "TDUST_SENDER_00000000000000000000"
    A = "TA_REAL_DESTINATION"
    txs = [
        _tx(DUST_SENDER, ORIGIN, days_ago=1500),   # old, irrelevant, incoming
        _tx(ORIGIN, A, days_ago=0),                 # today's real theft
    ]
    graph = _make_graph("case-stale-anchor", txs, window_days=90)

    node_addresses = {n.address for n in graph.nodes}
    bp_map = {bp.address: bp.reason for bp in graph.breakpoints}

    assert A in node_addresses, (
        "A stale, unrelated incoming transfer from years ago must not make "
        "today's real outgoing transfer look 'outside the window'."
    )
    assert bp_map.get(ORIGIN) != BreakpointReason.window_exceeded


def test_explicit_anchor_is_respected():
    """
    When the caller passes an anchor (Case.incident_reported_at), the window
    is built around THAT moment -- so a case anchored 1500 days ago traces
    a transfer from 1500 days ago, and ignores today's unrelated transfer.
    """
    A, LATER = "TA_OLD_CASE", "TLATER_UNRELATED"
    txs = [
        _tx(ORIGIN, A, days_ago=1500),
        _tx(ORIGIN, LATER, days_ago=0),
    ]
    graph = _make_graph(
        "case-anchor", txs, window_days=90,
        anchor=_now() - timedelta(days=1500),
    )
    node_addresses = {n.address for n in graph.nodes}
    assert A in node_addresses
    assert LATER not in node_addresses
