"""
reporter.py — Rajshree's module.

Builds and seals the final Report from a TraceGraph + list of Findings.

Sealing contract:
  • sealed_at  = current UTC datetime, captured immediately before hashing.
  • report_hash = SHA256 hex digest of the canonical JSON of every other
                  field in the report (sort_keys=True, no whitespace).
  • Re-hashing the identical content always reproduces the same hash.
  • Any post-seal edit changes the hash → tamper-evidence.
"""

import hashlib
import json
from datetime import datetime, timezone
from typing import List

from models import EvidenceLevel, Finding, Report, TraceGraph

# Strength order — used to pick the "highest" level across all findings
_LEVEL_ORDER: List[EvidenceLevel] = [
    EvidenceLevel.strong,
    EvidenceLevel.moderate,
    EvidenceLevel.weak,
    EvidenceLevel.unresolved,
]


def _pick_overall_level(findings: List[Finding]) -> EvidenceLevel:
    """Return the strongest EvidenceLevel seen across all findings."""
    if not findings:
        return EvidenceLevel.unresolved
    for level in _LEVEL_ORDER:
        if any(f.evidence_level == level for f in findings):
            return level
    return EvidenceLevel.unresolved


def _pick_conclusion(findings: List[Finding], overall: EvidenceLevel) -> str:
    """
    Produce a one-sentence verdict built from real finding data.
    Never invents information — uses only what the classifier computed.
    """
    if not findings:
        return "No nodes were classified; the trace produced no findings."

    strong = [f for f in findings if f.evidence_level == EvidenceLevel.strong]
    if strong:
        top = strong[0]
        return (
            f"Funds traced to {top.address} ({top.category}), "
            f"identified with strong evidence."
        )

    moderate = [f for f in findings if f.evidence_level == EvidenceLevel.moderate]
    if moderate:
        top = moderate[0]
        return (
            f"Funds likely reached {top.address} ({top.category}), "
            f"identified with moderate evidence."
        )

    if overall == EvidenceLevel.weak:
        return (
            f"Trace ended at {len(findings)} node(s) with only behavioral signals; "
            f"manual review recommended."
        )

    return (
        "Trace completed; endpoint(s) could not be identified "
        "with available data — all findings are unresolved."
    )


def build_report(
    case_id: str,
    graph: TraceGraph,
    findings: List[Finding],
) -> Report:
    """
    Assemble and cryptographically seal a Report.

    Steps:
      1. Derive overall_evidence_level and primary_conclusion from findings.
      2. Capture sealed_at = now(UTC).
      3. Serialise all fields except report_hash to canonical JSON
         (sort_keys=True, no whitespace separators).
      4. Compute report_hash = SHA256(canonical_bytes).hexdigest().
      5. Return the complete Report.
    """
    overall = _pick_overall_level(findings)
    conclusion = _pick_conclusion(findings, overall)
    sealed_at = datetime.now(timezone.utc)

    # Build the canonical representation — excludes report_hash itself
    canonical_dict = {
        "case_id": case_id,
        "graph": json.loads(graph.model_dump_json()),
        "findings": [json.loads(f.model_dump_json()) for f in findings],
        "primary_conclusion": conclusion,
        "overall_evidence_level": overall.value,
        "sealed_at": sealed_at.isoformat(),
    }
    canonical_bytes: bytes = json.dumps(
        canonical_dict, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")
    report_hash: str = hashlib.sha256(canonical_bytes).hexdigest()

    return Report(
        case_id=case_id,
        graph=graph,
        findings=findings,
        primary_conclusion=conclusion,
        overall_evidence_level=overall,
        sealed_at=sealed_at,
        report_hash=report_hash,
    )
