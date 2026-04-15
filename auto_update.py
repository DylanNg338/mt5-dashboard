import time
import os
import sys
import hashlib

os.chdir(os.path.dirname(os.path.abspath(__file__)))

LAST_HASH = None


def file_hash(path):
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


while True:
    print("Updating MT5 data...")

    # 1. Run collector
    os.system(f'"{sys.executable}" mt5_collector.py')

    file_path = "docs/data/dashboard_data.json"

    # 2. Check if file changed
    if os.path.exists(file_path):
        current_hash = file_hash(file_path)

        if current_hash != LAST_HASH:
            print("Data changed → pushing to GitHub")

            os.system("git add docs/data/dashboard_data.json")
            os.system('git commit -m "auto update MT5 data"')
            os.system("git push origin main")

            LAST_HASH = current_hash
        else:
            print("No change → skip Git push")

    time.sleep(60)  # safer interval (1 min)