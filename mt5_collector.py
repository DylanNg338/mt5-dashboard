import os
import json
import MetaTrader5 as mt5
from datetime import datetime, timedelta

# ---------------------------
# INIT MT5
# ---------------------------
if not mt5.initialize():
    print("MT5 initialize failed:", mt5.last_error())
    quit()

# ---------------------------
# ACCOUNT INFO
# ---------------------------
def get_account_info():
    acc = mt5.account_info()

    if acc is None:
        return {
            "error": "no_account"
        }

    return {
        "login": acc.login,
        "balance": float(acc.balance),
        "equity": float(acc.equity),
        "profit": float(acc.profit),
        "currency": acc.currency
    }

# ---------------------------
# FULL HISTORY (ALL TIME)
# ---------------------------
def get_history():
    # VERY EARLY START DATE (covers almost all accounts)
    start = datetime(2025, 1, 1)
    end = datetime.now()

    deals = mt5.history_deals_get(start, end)

    if deals is None:
        return []

    return [
        {
            "ticket": d.ticket,
            "symbol": d.symbol,
            "type": d.type,
            "volume": d.volume,
            "price": d.price,
            "profit": float(d.profit),
            "time": datetime.fromtimestamp(d.time).isoformat()
        }
        for d in deals
    ]

# ---------------------------
# BUILD OUTPUT
# ---------------------------
output = {
    "timestamp": datetime.now().isoformat(),
    "account": get_account_info(),
    "history": get_history()
}

# ---------------------------
# SAVE JSON
# ---------------------------
os.makedirs("docs/data", exist_ok=True)

file_path = "docs/data/dashboard_data.json"

with open(file_path, "w") as f:
    json.dump(output, f, indent=2)

print("✅ Dashboard data updated:", file_path)

# ---------------------------
# SHUTDOWN MT5
# ---------------------------
mt5.shutdown()