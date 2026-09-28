# Crypto Forensics MVP — AI Context Document

> **Note for AI Assistants (Claude, etc.):** Read this document to understand the project structure, constraints, and the current state of the backend before suggesting changes.

## 1. Project Overview

This is the backend for a **Victim-to-Cash-Out Crypto Forensics MVP** built for the Smart India Hackathon (SIH). 

**Goal:** Trace stolen TRON/USDT funds starting from a victim's wallet, through a bounded number of hops, to produce an evidence report naming the likely cash-out endpoint (usually an exchange). 

**Strict Architectural Constraints:**
- **Deterministic Logic Only:** No LLMs, ML models, or probabilistic methods are used in the tracing or classification logic. The exact same input must always produce the exact same report.
- **Backend Only:** The frontend (intake form, dashboard) is built independently in React. This repository contains **only** the FastAPI backend. Do not generate HTML/CSS/JS.
- **No Probabilistic Scoring:** Confidence is represented by a strict Enum (`EvidenceLevel`: Strong, Moderate, Weak, Unresolved). It is *never* a percentage or numeric score.
- **SQLite Persistence:** Uses SQLite via `SQLModel` for easy local demo setup.

---

## 2. Codebase Structure (The 5 Modules)

The backend is divided into interconnected modules, all wired together in `main.py`.

*   **`models.py` (Locked Schema)**
    *   Contains the Pydantic models (`Case`, `NormalizedTransaction`, `TraceGraph`, `Finding`, `Report`).
    *   *Rule:* These shapes are strictly locked. All modules must adhere to them.
*   **`fetch.py` (Ingestion)**
    *   Fetches TRC-20 transfers from the live TronGrid API (`api.trongrid.io`).
    *   Normalizes messy blockchain JSON into strict `NormalizedTransaction` objects. Handles cursor pagination.
*   **`tracer.py` (Graph Engine)**
    *   Builds a directed graph using `networkx`.
    *   Performs a Breadth-First Search (BFS) from the origin wallet.
    *   Applies strict breakpoints to halt traversal: `max_hops` (cap at 4 hops), `no_outgoing` (dead ends), and `window_exceeded` (transfers falling outside a 90-day window).
*   **`classifier.py` (Evidence Engine)**
    *   Evaluates nodes in the graph based on a 4-tier hierarchy:
        1.  **Strong:** Direct match in `known_labels.json`.
        2.  **Moderate/Weak:** Direct relationship (edges) to a known label.
        3.  **Moderate/Weak:** Behavioral patterns (e.g., consolidation/exchange deposit patterns based on high sender count).
        4.  **Unresolved:** No signals found.
    *   *Note:* Uses `known_labels.json` as a local ground-truth dataset.
*   **`database.py` & `reporter.py` (Persistence & Sealing)**
    *   `database.py`: SQLModel tables mapping 1:1 with `models.py` shapes. Handles SQLite CRUD operations.
    *   `reporter.py`: Assembles the final `Report`. Creates a cryptographic tamper-evident seal (`report_hash`) by taking the SHA-256 hash of the canonical JSON of the report contents.
*   **`main.py` (The Entrypoint)**
    *   FastAPI application defining the endpoints (`POST /cases`, `GET /cases/{case_id}/transfers`, `POST /cases/{case_id}/trace`).
    *   Wires the modules together synchronously in the `/trace` route.

---

## 3. What Has Been Done Up To Now (Current Status)

**Status:** The backend MVP is **100% complete, fully wired, and stable.**

1.  **Implementation:** All modules (`fetch`, `tracer`, `classifier`, `database`, `reporter`) are fully implemented and integrated into `main.py`.
2.  **Testing:** A robust `pytest` suite (`tests/test_backend.py`) was created using purely offline, hand-built fake data. **8/8 tests are passing.**
3.  **Bug Fixes Applied:**
    *   Fixed a BFS window boundary bug in `tracer.py` (ensured transfers predating the case incident anchor are correctly ignored).
    *   Upgraded `sqlmodel` to `v0.0.47` to fix a metaclass compatibility issue with Python 3.14 and Pydantic v2.
4.  **Documentation:** Added `README_LABELS.md` providing exact instructions on how the team must replace the placeholder seed data in `known_labels.json` with real, verified TronScan links before the final demo.

**Next Steps / Pending Actions (for the human team):**
- Run the server locally: `.\tama\Scripts\uvicorn.exe main:app --reload`
- Manually populate `known_labels.json` with real TRON addresses from TronScan/ChainAbuse prior to the demo (currently it contains marked placeholders to prevent accidental forensic fraud).
