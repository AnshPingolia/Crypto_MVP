# README — Replacing Placeholder Labels in `known_labels.json`

> **IMPORTANT — Read before the demo.**
> Every entry in `known_labels.json` is currently a **placeholder**.
> The address values are fake strings (e.g. `PLACEHOLDER_BINANCE_HOT_1`),
> not real TRON wallet addresses. The classification engine will only match
> a real address if you replace the placeholders with genuine, sourced entries.

---

## Why this matters

Putting a fabricated address in `known_labels.json` and labelling it
"Binance hot wallet" without a verifiable source is **forensic fraud** —
the report would assert something that isn't true. Every entry in this
file must have a real source URL that a reviewer can independently check.

Target: **30–50 entries** covering major TRON-based exchanges + any
community-flagged scam/mixer addresses you can verify.

---

## Step-by-step: How to find real, sourced TRON wallet labels

### Step 1 — Find hot wallet addresses on TronScan

1. Open **[https://tronscan.org](https://tronscan.org)** in your browser.
2. In the search bar, type the name of an exchange (e.g. `Binance`).
3. TronScan shows account pages for well-known entities. Example:
   - Search `Binance` → click a result tagged "Binance" → copy the
     TRON address from the URL bar or the page header.
   - Direct example search: `https://tronscan.org/#/address/`
     + the address you copied.
4. Verify on the TronScan account page that the **Name Tag** or **Label**
   field shows the exchange name (e.g. "Binance Hot Wallet 1").
5. Copy:
   - The **TRON address** (starts with `T`, 34 characters long).
   - The **page URL** — this becomes your `source` value.

### Step 2 — Find flagged/scammer addresses

1. On TronScan, go to **[https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/transfers](https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/transfers)**
   (USDT-TRC20 transfers). Look for addresses tagged with a red ⚠️ or
   "Risk" label by TronScan's own risk engine.
2. Alternatively, visit **[https://app.chainabuse.com](https://app.chainabuse.com)**
   and filter by chain = TRON. Copy flagged addresses + report URLs.
3. Only add an address if the label source URL is publicly accessible
   and the label was applied by TronScan or a recognised reporting body
   (not just a single user comment).

### Step 3 — Add each entry to `known_labels.json`

Open `known_labels.json` and add a JSON object for each verified address.
Follow this exact format (do NOT change the key names — the classifier
depends on them):

```json
{
  "address": "T<the 34-char TRON address>",
  "category": "known exchange",
  "label": "Binance Hot Wallet 1",
  "source": "https://tronscan.org/#/address/T<address>"
}
```

Valid `category` values (pick the closest match):
| category | When to use |
|---|---|
| `"known exchange"` | Verified CEX hot/cold wallet |
| `"flagged address"` | TronScan risk-flagged or ChainAbuse report |
| `"suspected mixer"` | Mixing-pattern evidence from a public source |
| `"DEX liquidity pool"` | Known on-chain DEX pool address |
| `"mining pool"` | Verified mining/staking pool |

### Step 4 — Delete the placeholder entries

Remove all entries whose `"address"` field starts with `PLACEHOLDER_`.
Those strings are not valid TRON addresses and will never match a real trace.

### Step 5 — Verify your additions

Run the unit tests to make sure the JSON is valid and the classifier still
loads it without error:

```powershell
.\tama\Scripts\activate
pytest tests/ -v -k "known_label"
```

---

## Quick reference: TronScan pages to check

| Exchange | TronScan search URL |
|---|---|
| Binance | `https://tronscan.org/#/contract?name=Binance` |
| Huobi / HTX | `https://tronscan.org/#/contract?name=Huobi` |
| OKX | `https://tronscan.org/#/contract?name=OKX` |
| Bybit | `https://tronscan.org/#/contract?name=Bybit` |
| KuCoin | `https://tronscan.org/#/contract?name=KuCoin` |
| Gate.io | `https://tronscan.org/#/contract?name=Gate` |
| Bitget | `https://tronscan.org/#/contract?name=Bitget` |

---

## What the `source` field must contain

The `source` field must be a **URL a human can click** and see the label
with their own eyes. Acceptable formats:

- `"https://tronscan.org/#/address/T<address>"` ← preferred
- `"https://app.chainabuse.com/reports/<report-id>"` ← for scam flags
- `"https://etherscan.io/..."` ← **not acceptable** (wrong chain)
- `"someone told me"` ← **not acceptable**

If you cannot find a public URL for an address, do not add it.

---

*Last updated by backend scaffold (Day 2). Update this file if the
schema changes or new category values are added.*
