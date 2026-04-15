import time
import os

while True:
    print("Updating MT5 data...")
    os.system("python mt5_collector.py")
    time.sleep(30)  # update every 30 seconds