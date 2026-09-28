# Frontend ↔ Backend Endpoint Audit

This audit is based on the current frontend and the current backend contract previously supplied for `models.py` and `main.py`.

## What now works in the frontend data layer

1. The frontend can stay in mock mode.
2. The frontend can switch to backend mode with `VITE_DATA_SOURCE=backend`.
3. `POST /cases` is called with the field names and fields required by the current backend:
   - `case_id`
   - `wallet_address`
   - `chain`
   - `status`
4. `GET /cases` is supported.
5. The missing `GET /cases/{case_id}` endpoint is worked around by loading the case list and selecting the requested case.
6. `GET /cases/{case_id}/transfers` is wired in the data layer for later investigation UI use.
7. `POST /cases/{case_id}/trace` is wired in the data layer for later investigation UI use.

## Current contract limitations

1. The backend `Case` model does not return `submitted_at`. The frontend therefore remembers the submission time locally for cases created from that browser. Existing backend cases without a locally remembered time display `Not provided`.
2. The frontend form still has `notes`, but the current backend contract does not store that field. The backend mode does not falsely claim that the notes were saved.
3. The current backend still has no dedicated `GET /cases/{case_id}` endpoint. The frontend currently avoids requiring one.

## Files changed

- `src/lib/api/cases.api.ts` — backend request functions and backend response types.
- `src/lib/mock/cases.mock.ts` — one data interface for mock mode and backend mode.
- `src/vite-env.d.ts` — environment variable types.
- `.env.example` — backend-mode configuration example.
- `src/lib/DATA_LAYER.md` — updated data-layer documentation.
- `src/pages/Home.jsx` — safe display when backend has no submission timestamp.
- `src/pages/Dashboard.jsx` — safe display when backend has no submission timestamp.
- `src/pages/CaseDetail.jsx` — safe display when backend has no submission timestamp.
