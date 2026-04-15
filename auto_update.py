import schedule
import time
import subprocess
from mt5_collector import MT5DataCollector
import os

def update_data():
    """Update MT5 data and push to GitHub"""
    print(f"Updating data at {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Collect data
    collector = MT5DataCollector()
    data = collector.collect_all_data(['XAUUSD', 'EURUSD', 'GBPUSD'])
    collector.save_to_json(data, 'docs/data/dashboard_data.json')
    collector.shutdown()
    
    # Git commands to push to GitHub
    try:
        subprocess.run(['git', 'add', 'docs/data/dashboard_data.json'], check=True)
        subprocess.run(['git', 'commit', '-m', f'Update data {time.strftime("%Y-%m-%d %H:%M:%S")}'], check=True)
        subprocess.run(['git', 'push'], check=True)
        print("Data pushed to GitHub successfully")
    except subprocess.CalledProcessError as e:
        print(f"Git error: {e}")

# Schedule updates every 5 minutes
schedule.every(5).minutes.do(update_data)

# Run immediately on start
update_data()

# Keep running
while True:
    schedule.run_pending()
    time.sleep(1)