"""
FastAPI entrypoint for the Victim-to-Cash-Out Crypto Forensics MVP.

Endpoint summary
----------------
GET  /                             Health check.
POST /cases                        Create + persist a new case.
GET  /cases                        List all cases.
GET  /cases/{case_id}/transfers    Fetch + normalise TRC-20 transfers for the
                                   case's wallet from TronGrid, persist them,
                                   and return the list.
POST /cases/{case_id}/trace        Full pipeline:
                                     1. fetch + normalise (fetch.py)
                                     2. BFS trace graph   (tracer.py)
                                     3. classify nodes    (classifier.py)
                                     4. build + seal report (reporter.py)
                                   Returns a sealed Report.

CORS is configured here (backend concern) — the actual frontend is a
separate React + UX4G project; this file does not touch it.
"""

from datetime import datetime, timezone
from typing import List

import httpx

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import database as db
from classifier import classify_leaf
from fetch import fetch_transfers
from models import Case, CaseCreate, Finding, NormalizedTransaction, Report, TraceGraph
from reporter import build_report
from tracer import trace_graph

app = FastAPI(
    title="Crypto Forensics API",
    description=(
        "Traces stolen TRON/USDT funds through a bounded number of hops "
        "and produces a tamper-evident evidence report."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten to the frontend origin before production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    """Create database tables on first boot (idempotent)."""
    db.init_db()


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok"}


# ── Case management ───────────────────────────────────────────────────────────

@app.post("/cases", response_model=Case)
def create_case(payload: CaseCreate) -> Case:
    """
    Persist a new case and return it. The client sends the same four fields
    as before; the server stamps `incident_reported_at` itself, because that
    timestamp anchors the trace's time window and must not be client-supplied.
    """
    case = Case(**payload.model_dump(), incident_reported_at=datetime.now(timezone.utc))
    db.create_case(case)
    return case


@app.get("/cases", response_model=List[Case])
def list_cases() -> List[Case]:
    """Return all stored cases."""
    return [db.case_from_row(row) for row in db.get_all_cases()]


# ── Transfer fetch ─────────────────────────────────────────────────────────────

@app.get("/cases/{case_id}/transfers", response_model=List[NormalizedTransaction])
def get_transfers(case_id: str) -> List[NormalizedTransaction]:
    """
    Fetch TRC-20 transfers from TronGrid for the case's wallet address,
    normalise them into the locked schema, persist them, and return them.

    Raises 404 if the case does not exist.
    """
    case = db.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")
    transfers = fetch_transfers(case.wallet_address)
    db.save_transactions(case_id, transfers)
    return transfers


# ── Full trace pipeline ───────────────────────────────────────────────────────

@app.post("/cases/{case_id}/trace", response_model=Report)
def trace_case(case_id: str) -> Report:
    """
    Run the full forensics pipeline for a case:
      1. fetch.fetch_transfers()       — TronGrid → NormalizedTransaction list
      2. tracer.trace_graph()          — bounded BFS → TraceGraph
      3. classifier.classify_leaf()    — evidence hierarchy → Finding per node
      4. reporter.build_report()       — assemble + SHA256-seal → Report

    All four steps are plain, synchronous, in-process function calls.
    Raises 404 if the case does not exist.
    """
    case = db.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")

    # Step 1: Fetch + normalise
    try:
        transfers: List[NormalizedTransaction] = fetch_transfers(case.wallet_address)
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            raise HTTPException(status_code=502, detail="TronGrid rate limit exceeded. Please try again in a minute.")
        raise HTTPException(status_code=502, detail=f"TronGrid API error: {e}")
        
    db.save_transactions(case_id, transfers)

    # Step 2: BFS trace (deterministic, networkx-based)
    graph: TraceGraph = trace_graph(
        case_id=case_id,
        origin=case.wallet_address,
        transfers=transfers,
        anchor=case.incident_reported_at,
    )

    # Step 3: Classify every node in the graph
    findings: List[Finding] = [classify_leaf(node, graph) for node in graph.nodes]
    db.save_findings(case_id, findings)

    # Step 4: Assemble + cryptographically seal the report
    report: Report = build_report(case_id=case_id, graph=graph, findings=findings)
    return report