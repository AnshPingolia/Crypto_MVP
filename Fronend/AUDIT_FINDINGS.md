# Investigation Graph — Final Deliverable Report

## 1. Understanding confirmed

`tracer.py` (Parth, read-only) runs a bounded BFS from the origin wallet and returns a `TraceGraph`
(`case_id`, `nodes`, `edges`, `breakpoints`). `main.py`'s `POST /cases/{case_id}/trace` (read-only)
wraps that graph through classification and report-sealing into a `Report`. The frontend's job
starts at that `Report` — it never runs its own trace and never touches the three backend files.

## 2. Files changed

- `src/lib/api/cases.api.ts` — replaced the `unknown` / `unknown[]` placeholder types on
  `ReportResponse` with fully typed `TraceGraph`, `TraceGraphNode`, `TraceGraphEdge`, `Breakpoint`,
  `Finding`, and `EvidenceLevel`, matching `models.py` field-for-field (`from_address`/`to_address`,
  `hop_distance`, etc. — nothing renamed).
- `src/lib/mock/cases.mock.ts` — removed one pre-existing unused import (`CaseStatus`) that was
  failing `tsc --noEmit` and blocking `npm run build`. This is the only change to this file; the
  mock/backend data-source architecture itself was left exactly as it already was.
- `src/pages/CaseDetail.jsx` — replaced the static "Trace Graph Coming Soon" placeholder card's
  inner content with `<InvestigationPanel caseId={caseData.case_id} />`. Nothing else on this page,
  and no other page, was touched.

## 3. Files added

- `src/components/graph/InvestigationPanel.tsx` — orchestrator: run button, loading/error/empty
  states, calls the real backend or mock data depending on `VITE_DATA_SOURCE`, composes the three
  pieces below.
- `src/components/graph/TraceGraphView.tsx` — React Flow canvas with dagre auto-layout, directional
  edges, zoom/pan/fit-to-screen, MiniMap for large graphs.
- `src/components/graph/WalletNode.tsx` — custom node: address, hop distance, category/evidence
  badge, distinct breakpoint styling.
- `src/components/graph/EvidencePanel.tsx` — full details panel for a selected wallet or transfer.
- `src/components/graph/ReportSummary.tsx` — case ID, evidence level, conclusion, sealed time, hash,
  node/edge/breakpoint counts, findings list.
- `src/components/graph/graphUtils.ts` — address truncation, evidence-badge class mapping,
  breakpoint-reason text, date formatting.
- `src/components/graph/graph.css` — styling for the above, reusing `theme.css`'s existing tokens.
- `src/lib/mock/trace.mock.ts` — mock `Report` generator, same shape as the real backend response,
  covering 5 distinct scenarios (see Testing below).

## 4. Packages added

- `reactflow` (^11.11.4) — graph rendering, zoom/pan/selection
- `dagre` (^0.8.5) — automatic left-to-right layout of the real backend edges (no relationships
  invented or altered to force a tree shape)
- `@types/dagre` (^0.7.52, dev only)

No other libraries were added or considered.

## 5. API endpoint used

`POST /cases/{case_id}/trace` only. No other or duplicate tracing endpoint was created.

## 6. Exact backend response fields consumed

From `Report`: `case_id`, `graph`, `findings`, `primary_conclusion`, `overall_evidence_level`,
`sealed_at`, `report_hash`.
From `TraceGraph`: `nodes`, `edges`, `breakpoints`.
From `TraceGraphNode`: `address`, `label`, `hop_distance`.
From `TraceGraphEdge`: `from_address`, `to_address`, `amount`, `hash`.
From `Breakpoint`: `address`, `reason` (`max_hops` | `no_outgoing` | `window_exceeded`).
From `Finding`: `address`, `category`, `evidence_level`, `reasoning`, `contradicting_evidence`.

No field was renamed and no field was invented.

## 7. Exact BFS fields consumed

`hop_distance` (drives the "Hop N" label and dagre rank), and the three `Breakpoint.reason` values
verbatim — no other breakpoint behavior was assumed.

## 8. Incompatibilities discovered

**None that block the frontend from consuming the real `Report` shape.** One pre-existing,
unrelated build issue was found and fixed (see Files changed, #2) — this was a TypeScript unused-
import error, not a backend/frontend schema mismatch, so it did not need to be "reported and
stopped on" under the backend-incompatibility rule; it was simply broken independently of this task.

One thing worth flagging to the team, separate from this task: the project's `package.json` does not
list `ux4g-web-components` as a dependency, and the existing pages use inline styles rather than
UX4G's own component classes, even though `Frontend-BRD.md` and the `.agents/skills/ux4g-design/`
files both specify it. That predates this change and sits outside the trace-graph scope, so it was
left alone — flagging it here rather than silently fixing it, since it touches pages outside this
task's boundary.

## 9. How to run

```
npm install
npm run dev
```

Mock mode is the default — no backend required. To point at the real backend instead:

```
# .env
VITE_DATA_SOURCE=backend
VITE_API_BASE_URL=http://localhost:8000
```

## 10. How to test the investigation flow

Mock mode ships five case IDs, each exercising a different scenario. Submit a case with one of these
exact addresses via the intake form, or open an existing mock case from the dashboard, then press
**Run investigation** on its detail page:

| Case ID | Scenario |
|---|---|
| `CASE-2024-001` | Normal multi-hop, branching trace, mixed evidence levels |
| `CASE-2024-002` | Short trace, single Strong match, resolved |
| `CASE-2024-003` | Breakpoint-heavy (`no_outgoing` and `window_exceeded`), overall Unresolved |
| `CASE-2024-004` | One-node graph — origin has no outgoing transfers at all |
| `CASE-2024-005` | Large graph (~40 nodes across 4 hops) — stresses layout and MiniMap |

Any other case ID falls back to the branching scenario, so a freshly submitted case still shows a
complete result. Backend-mode error and empty-graph states were verified against `TraceGraphView`'s
explicit zero-node guard and `InvestigationPanel`'s try/catch — a failed or empty backend response
renders the error or empty state, never a blank screen.
