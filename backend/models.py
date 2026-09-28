"""
Shared Pydantic schema for the Victim-to-Cash-Out Crypto Forensics MVP.
Locked on Day 1 -- every module (Pulkit, Ansh, Parth, Isshan, Rajshree, Priyanshi)
builds against these exact shapes for the rest of the week.
"""

from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional


# ---------- Case (Pulkit's intake form -> Ansh's API) ----------

class CaseCreate(BaseModel):
    """What the frontend sends to POST /cases -- shape unchanged, so the
    already-built frontend keeps working."""
    case_id: str
    wallet_address: str
    chain: str
    status: str


class Case(CaseCreate):
    """The stored / returned case. Adds a server-set timestamp."""
    # Set by the server the moment the case is opened -- never sent by the
    # client. tracer.py anchors its time window on this, NOT on anything
    # derived from the wallet's own transfer history (old spam/dust
    # transfers must not be able to move the window).
    incident_reported_at: datetime
    incident_reported_at: Optional[datetime] = None
    # When the case was opened -- the real anchor for tracer.py's bounded
    # time window. Set server-side (to now, UTC) in main.py's create_case()
    # if the caller doesn't supply one, so it's never left to be guessed
    # from the wallet's own transfer history (an old, unrelated transfer
    # must never be allowed to push the window back and hide a genuine,
    # recent theft -- see test_stale_incoming_transfer_does_not_poison_window_anchor).


# ---------- Normalized transaction (Ansh: fetch + normalize) ----------

class NormalizedTransaction(BaseModel):
    hash: str
    from_address: str
    to_address: str
    amount: Decimal          # converted using `decimals`, never a raw string
    asset: str                # display symbol, e.g. "USDT"
    asset_contract: str       # the token's real contract address -- proves it's
                               # the genuine token, not a same-named fake
    time: datetime             # converted from TronGrid's raw millisecond timestamp
    raw_value: str             # untouched value TronGrid sent, kept for auditability
    decimals: int               # decimals TronGrid reported for this token


# ---------- Trace graph (Parth: bounded BFS trace) ----------

class BreakpointReason(str, Enum):
    max_hops = "max_hops"
    no_outgoing = "no_outgoing"
    window_exceeded = "window_exceeded"


class TraceGraphNode(BaseModel):
    address: str
    label: Optional[str] = None
    hop_distance: int          # steps from the origin wallet, so Priyanshi and
                                 # Isshan don't have to recompute it from edges


class TraceGraphEdge(BaseModel):
    from_address: str
    to_address: str
    amount: Decimal
    hash: str


class Breakpoint(BaseModel):
    address: str
    reason: BreakpointReason


class TraceGraph(BaseModel):
    case_id: str
    nodes: List[TraceGraphNode]
    edges: List[TraceGraphEdge]
    breakpoints: List[Breakpoint]


# ---------- Classification (Isshan: evidence hierarchy) ----------

class EvidenceLevel(str, Enum):
    weak = "Weak"
    moderate = "Moderate"
    strong = "Strong"
    unresolved = "Unresolved"
    # never a percentage / ML confidence score -- locked decision from Day 1


class Finding(BaseModel):
    address: str
    category: str              # e.g. "known exchange", "unrecognized wallet"
    evidence_level: EvidenceLevel
    reasoning: str
    # Added Day 2: spec section 3C requires recording discarded/conflicting signals
    # rather than silently dropping them.  The original Day-1 lock omitted this
    # field -- gap filled here per the spec's own rule ("add with a comment").
    contradicting_evidence: Optional[str] = None


# ---------- Final report (Rajshree: save + seal) ----------

class Report(BaseModel):
    case_id: str
    graph: TraceGraph
    findings: List[Finding]
    primary_conclusion: str     # one-sentence headline verdict for the case
    overall_evidence_level: EvidenceLevel
    sealed_at: datetime          # when report_hash was computed -- part of
                                   # the chain-of-custody story
    report_hash: str            # SHA256 of the above, for tamper-evidence