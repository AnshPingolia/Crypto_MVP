import httpx
import json

def fetch_exchange(name):
    url = f"https://apilist.tronscanapi.com/api/search?keyword={name}"
    resp = httpx.get(url)
    data = resp.json()
    results = []
    
    if "addressInfo" in data and "addressList" in data["addressInfo"]:
        for item in data["addressInfo"]["addressList"]:
            addr = item.get("address")
            label = item.get("name")
            if addr and label and name.lower() in label.lower():
                results.append({"address": addr, "label": label, "source": f"https://tronscan.org/#/address/{addr}"})
                
    return results

all_labels = []
for ex in ["Binance", "Huobi", "OKX", "Bybit", "KuCoin", "Gate.io", "Bitget", "MEXC"]:
    print(f"Fetching {ex}...")
    res = fetch_exchange(ex)
    all_labels.extend(res)

with open("scratch_labels.json", "w") as f:
    json.dump(all_labels, f, indent=4)
print(f"Saved {len(all_labels)} labels.")
