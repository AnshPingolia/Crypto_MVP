"""
database.py — Rajshree's module.

SQLModel table definitions and CRUD helpers.
Database: SQLite (default) or any SQLAlchemy-compatible URL via DATABASE_URL env var.
Tables: CaseDB, TransactionDB, FindingDB — each maps 1-to-1 to models.py shapes.

Table creation: SQLModel.metadata.create_all() only — no Alembic migrations.
"""

import os
from datetime import datetime, timezone
from typing import List, Optional

from sqlmodel import Field, Session, SQLModel, create_engine, select

from models import Case, Finding, NormalizedTransaction

DATABASE_URL: str = os.environ.get(
    "DATABASE_URL",
    "sqlite:///./forensics.db",
)

# SQLite needs check_same_thread=False for multi-threaded use (FastAPI default)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)


# ── Table definitions ─────────────────────────────────────────────────────────

class CaseDB(SQLModel, table=True):
    __tablename__ = "cases"

    case_id: str = Field(primary_key=True)
    wallet_address: str
    chain: str
    status: str
    incident_reported_at: datetime


class TransactionDB(SQLModel, table=True):
    __tablename__ = "transactions"

    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: str = Field(index=True)
    hash: str
    from_address: str
    to_address: str
    # Decimal is not a native SQLite/SQLAlchemy column type; stored as text
    amount: str
    asset: str
    asset_contract: str
    time: datetime
    raw_value: str
    decimals: int


class FindingDB(SQLModel, table=True):
    __tablename__ = "findings"

    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: str = Field(index=True)
    address: str
    category: str
    evidence_level: str   # stored as the enum's string value
    reasoning: str
    contradicting_evidence: Optional[str] = None


# ── Initialisation ────────────────────────────────────────────────────────────

def init_db() -> None:
    """Create all tables if they do not already exist."""
    SQLModel.metadata.create_all(engine)


# ── CRUD helpers ──────────────────────────────────────────────────────────────

def create_case(case: Case) -> None:
    """Persist a new Case (Pydantic) to the database."""
    with Session(engine) as session:
        db_obj = CaseDB(**case.model_dump())
        session.add(db_obj)
        session.commit()


def case_from_row(row: CaseDB) -> Case:
    """
    Convert a CaseDB row back into a Case. SQLite drops timezone info on
    DATETIME columns, so re-attach UTC (we only ever store UTC).
    """
    ts = row.incident_reported_at
    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=timezone.utc)
    return Case(
        case_id=row.case_id,
        wallet_address=row.wallet_address,
        chain=row.chain,
        status=row.status,
        incident_reported_at=ts,
    )


def get_all_cases() -> List[CaseDB]:
    """Return all stored cases."""
    with Session(engine) as session:
        return list(session.exec(select(CaseDB)).all())


def get_case(case_id: str) -> Optional[CaseDB]:
    """Return one CaseDB row by primary key, or None if not found."""
    with Session(engine) as session:
        return session.get(CaseDB, case_id)


def save_transactions(case_id: str, transactions: List[NormalizedTransaction]) -> None:
    """
    Persist a list of NormalizedTransaction objects for a given case.
    Existing rows for this case_id are not deleted first (idempotency via
    caller — `POST /trace` may call this more than once; duplicates are
    harmless for an MVP but worth noting for production use).
    """
    with Session(engine) as session:
        for tx in transactions:
            db_obj = TransactionDB(
                case_id=case_id,
                hash=tx.hash,
                from_address=tx.from_address,
                to_address=tx.to_address,
                amount=str(tx.amount),
                asset=tx.asset,
                asset_contract=tx.asset_contract,
                time=tx.time,
                raw_value=tx.raw_value,
                decimals=tx.decimals,
            )
            session.add(db_obj)
        session.commit()


def get_transactions(case_id: str) -> List[TransactionDB]:
    """Return all stored TransactionDB rows for a case."""
    with Session(engine) as session:
        return list(
            session.exec(
                select(TransactionDB).where(TransactionDB.case_id == case_id)
            ).all()
        )


def save_findings(case_id: str, findings: List[Finding]) -> None:
    """Persist a list of Finding objects for a given case."""
    with Session(engine) as session:
        for f in findings:
            db_obj = FindingDB(
                case_id=case_id,
                address=f.address,
                category=f.category,
                evidence_level=f.evidence_level.value,
                reasoning=f.reasoning,
                contradicting_evidence=f.contradicting_evidence,
            )
            session.add(db_obj)
        session.commit()