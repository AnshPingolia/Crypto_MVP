# Frontend BRD — Victim-to-Cash-Out Crypto Fraud Tracer
## Frontend-Only Scope Document (for AI coding agent use)

---

## 0. Scope Statement — Read This First

**Build only the frontend scope described in this document.**

This is a frontend-only implementation phase. Do not expand this task into backend development, blockchain integration, database development, fund tracing, endpoint classification, report hashing, authentication, or real API integration. Every one of those is owned by a different team member and is explicitly out of scope here, regardless of how complete or "obvious" it might seem to add once the UI is built.

If any instruction elsewhere in this document could be read as implying backend work, this section overrides it: **frontend only, mock data only.**

---

## 1. What You Are Building

A frontend-only React application for a crypto-fraud tracing tool. A user submits a wallet address, sees it appear in a case dashboard, and can open a case detail page. Nothing behind the form is real yet — all data is mocked. The application must look and function like a polished, complete government digital service, even though no backend exists.

---

## 2. Explicitly Forbidden

Do not implement any of the following, under any circumstance, even if it would make a feature "work properly":

- Backend development of any kind
- FastAPI or any other server framework
- TronGrid or any blockchain API integration
- Real cryptocurrency address tracing or BFS logic
- Endpoint classification / evidence hierarchy logic
- PostgreSQL or any database
- Report hashing / SHA256 sealing
- Authentication or user accounts
- Real API calls of any kind
- Next.js, or a Next.js project structure

All "submission," "fetching," and "loading" behavior in this phase must be simulated with mock data and artificial delays only.

---

## 3. Required Screens

### 3.1 Intake Screen

The user must be able to:
- Enter a cryptocurrency wallet address
- Select a blockchain (TRON enabled; other chains visible but disabled, labeled "Coming soon")
- Enter optional incident notes
- Submit the form

Required states:
- Clear page heading and a plain-language explanation of what the tool does, above the form
- Field-level validation states (valid / invalid / empty)
- Error states with inline, accessible error messages
- Loading state during mock submission
- Success behavior: on mock submit, generate a fake `case_id` and route to the dashboard or the new case's detail page

Submission is mocked — no real network call. Simulate a short delay (e.g. via `setTimeout`) before resolving, so the loading state is actually visible and testable.

### 3.2 Dashboard

A case dashboard listing previously submitted cases (mock data).

**Columns / fields to display per case:**
- Case ID
- Truncated wallet address
- Chain
- Status
- Submitted date

**Allowed status values (exactly these three, no others):**
- `In Progress`
- `Resolved`
- `Breakpoint`

Each status must be visually distinct (e.g. distinct badge colors).

Required states:
- Empty state (zero cases) — clear message, not a blank screen
- Loading state (skeleton or spinner) while mock data "loads"
- Populated state
- Responsive layout (desktop and mobile)
- Clickable case rows/cards that route to that case's detail page

### 3.3 Case Detail

A routed page for a single case, showing:
- Case ID
- Wallet address
- Chain
- Status
- Submitted date

**The trace graph must NOT be implemented.** In its place, build a clearly labeled placeholder area (e.g. "Trace graph will appear here") reserving the space and layout where it will later be mounted by another team member's component. Do not invent graph functionality, fake nodes/edges, or any visualization logic — a static placeholder only.

---

## 4. Data Structures — Locked Shape

Every mock case, everywhere in the application, must use exactly this structure. Do not rename, restructure, or add alternate field names.

```json
{
  "case_id": "string",
  "address": "string",
  "chain": "string",
  "status": "In Progress | Resolved | Breakpoint",
  "submitted_at": "ISO 8601 datetime string"
}
```

**Do not introduce alternative field names**, including but not limited to:
- `case_status` (use `status`)
- `wallet` or `wallet_address` (use `address`)
- `created_at` (use `submitted_at`)

If a display-only derived value is needed (e.g. a truncated address for the table), compute it at render time from the locked fields above — do not store it as a separate field on the case object itself.

Generate a small, realistic mock dataset (5–8 cases) covering all three status values, including at least one with a long address requiring truncation.

---

## 5. Technology Requirements

- React
- Vite
- JavaScript or TypeScript
- UX4G Design System (`ux4g-web-components`)
- Tailwind CSS — layout and spacing only; use UX4G's own classes for interactive components (buttons, inputs, badges) rather than custom Tailwind-styled equivalents
- React Router for routing between Intake, Dashboard, and Case Detail
- `react-hook-form` + `zod` for the intake form's validation

**Explicitly do not use:** Next.js, or any Next.js-specific project structure or APIs.

---

## 6. Design Requirements

The application must look like a polished, Government of India digital service — the same visual language as an official e-governance portal, not a generic dashboard template.

Follow UX4G's own conventions for:
- Typography and spacing
- Components (buttons, inputs, badges, cards, navigation)
- Responsive behavior
- Visual hierarchy
- Government interface conventions (official header, accessibility toolbar, standard footer)

Do not invent a separate design system or deviate from UX4G's components for anything the design system already provides.

**Before implementing any UI, read the following files in this order:**
```
.agents/skills/ux4g-design/SKILL.md
.agents/skills/ux4g-design/Design.md
```
These define the exact component usage and design conventions to follow. Do not begin building screens until both have been read.

---

## 7. Accessibility Requirements

Target **WCAG 2.1 AA** as the minimum bar across every screen. This must include:

- Full keyboard navigation for every interactive element
- Visible focus states (never suppressed)
- Properly associated labels on all form fields
- Accessible, announced form error messages
- Semantic HTML throughout (proper heading levels, landmarks, list/table markup)
- Sufficient color contrast on all text and status indicators
- Status badges and indicators that convey meaning through more than color alone (e.g. icon or text, not color only)
- Fully responsive behavior across mobile and desktop viewport widths

---

## 8. Mock Behavior Expectations

- All data (cases, submission results) comes from local mock data or in-memory state — no network requests
- Simulate realistic latency on "submission" and "loading" so these states are visibly testable, not instantaneous
- New cases created via the intake form's mock submission should be reflected in the dashboard's mock case list for the duration of the session
- No data needs to persist across a page refresh — this is expected and acceptable at this stage

---

## 9. Definition of Done

This phase is complete when:

- All three screens (Intake, Dashboard, Case Detail) are built and routed correctly
- Every case object, everywhere, matches the locked data shape exactly
- All required UI states are implemented and demonstrable: empty, loading, populated, error, success
- The application visually reads as a finished, polished government digital service, built entirely with UX4G components
- WCAG 2.1 AA requirements are met across all screens
- No backend, API, blockchain, database, or tracing logic of any kind has been implemented
- The trace graph area exists only as a clearly labeled placeholder
