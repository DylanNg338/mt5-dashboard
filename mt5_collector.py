import MetaTrader5 as mt5
import pandas as pd
import json
from datetime import datetime

# ---------------------------
# CONNECT TO MT5
# ---------------------------
if not mt5.initialize():
    print("MT5 initialize() failed")
    quit()

symbol = "XAUUSD"
timeframe = mt5.TIMEFRAME_H1
bars = 200

# ---------------------------
# GET DATA
# ---------------------------
rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, bars)

if rates is None:
    print("Failed to get data")
    mt5.shutdown()
    quit()

# ---------------------------
# CONVERT TO DATAFRAME
# ---------------------------
df = pd.DataFrame(rates)
df["time"] = pd.to_datetime(df["time"], unit="s")

# Keep only needed columns
df = df[["time", "open", "high", "low", "close"]]

# ---------------------------
# CONVERT TO JSON FORMAT
# ---------------------------
data = df.to_dict(orient="records")

# ---------------------------
# SAVE TO DASHBOARD FILE
# ---------------------------
output_path = "docs/data/dashboard_data.json"

with open(output_path, "w") as f:
    json.dump(data, f, default=str, indent=2)

print(f"Saved {len(data)} bars to {output_path}")

# ---------------------------
# CLOSE MT5 CONNECTION
# ---------------------------
mt5.shutdown()
