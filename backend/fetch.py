"""
fetch.py — Ansh's module.

Fetches TRC-20 transfers from TronGrid and normalises the raw response
into the locked NormalizedTransaction schema.

Verified request pattern (from tron_poc.py + test_output.json):
  GET https://api.trongrid.io/v1/accounts/{address}/transactions/trc20
  Response fields used:
    transaction_id, from, to, value (raw string), token_info.symbol,
    token_info.address, token_info.decimals, block_timestamp (ms epoch)
"""

import httpx
from datetime import datetime, timezone
from decimal import Decimal
from typing import List

from models import NormalizedTransaction

TRONGRID_BASE = "https://api.trongrid.io/v1/accounts/{address}/transactions/trc20"
MAX_FETCH_PAGES = 4   # configurable; 4 pages × 50 = 200 transfers max
PAGE_SIZE = 50


def normalize(raw_tx: dict) -> NormalizedTransaction:
    """
    Map one raw TronGrid TRC-20 transfer dict to NormalizedTransaction.

    Field mapping (verified against test_output.json):
      transaction_id      -> hash
      from                -> from_address
      to                  -> to_address
      value               -> raw_value (kept verbatim for auditability)
                             amount = Decimal(value) / 10**decimals
      token_info.symbol   -> asset
      token_info.address  -> asset_contract
      token_info.decimals -> decimals
      block_timestamp     -> time (ms since Unix epoch → UTC datetime)
    """
    token = raw_tx["token_info"]
    decimals = int(token["decimals"])
    raw_value = str(raw_tx["value"])
    amount = Decimal(raw_value) / Decimal(10 ** decimals)
    ts_ms = int(raw_tx["block_timestamp"])
    dt = datetime.fromtimestamp(ts_ms / 1000, tz=timezone.utc)

    return NormalizedTransaction(
        hash=raw_tx["transaction_id"],
        from_address=raw_tx["from"],
        to_address=raw_tx["to"],
        amount=amount,
        asset=token["symbol"],
        asset_contract=token["address"],
        time=dt,
        raw_value=raw_value,
        decimals=decimals,
    )


def fetch_transfers(address: str) -> List[NormalizedTransaction]:
    """
    Fetch up to MAX_FETCH_PAGES pages of TRC-20 transfers for `address`
    from TronGrid.  Follows the fingerprint cursor for pagination.
    Returns a flat list of NormalizedTransaction objects.

    Raises:
        httpx.HTTPStatusError: on non-2xx from TronGrid.
    """
    url = TRONGRID_BASE.format(address=address)
    results: List[NormalizedTransaction] = []
    params: dict = {"limit": PAGE_SIZE}

    for _ in range(MAX_FETCH_PAGES):
        resp = httpx.get(url, params=params, timeout=15.0)
        resp.raise_for_status()
        body = resp.json()
        data = body.get("data", [])
        for raw in data:
            results.append(normalize(raw))
        # TronGrid paginates via a fingerprint cursor in meta.fingerprint
        fingerprint = body.get("meta", {}).get("fingerprint")
        if not fingerprint or len(data) < PAGE_SIZE:
            break  # last page
        params = {"limit": PAGE_SIZE, "fingerprint": fingerprint}

    return results
