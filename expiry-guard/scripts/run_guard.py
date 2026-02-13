import asyncio
import logging
import sys
import os

# Add parent directory to path to allow importing expiry_monitor
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from expiry_monitor.tracker import ExpiryTracker
from expiry_monitor.alerter import ExpiryAlerter
from expiry_monitor.renewal import RenewalService

async def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    logger = logging.getLogger("ExpiryGuard")

    # Configuration (In real project, these would come from config.py or .env)
    API_URL = "http://localhost:3000"  # Local Next.js dashboard API
    ACCOUNT_NAME = "test-user"
    THRESHOLD_DAYS = 30 # For demo, we use 30 days
    AUTO_RENEW = False

    logger.info("🚀 Starting Shelby Expiry Guard...")

    tracker = ExpiryTracker(API_URL, threshold_days=THRESHOLD_DAYS)
    alerter = ExpiryAlerter()
    renewer = RenewalService(API_URL)

    # 1. Track
    logger.info(f"Checking for expiring blobs for {ACCOUNT_NAME}...")
    expiring = await tracker.get_expiring_blobs(ACCOUNT_NAME)

    # 2. Alert
    await alerter.send_alerts(expiring)

    # 3. Renew (Optional)
    if AUTO_RENEW and expiring:
        logger.info("Auto-renewal enabled. Processing renewals...")
        blob_ids = [b["id"] for b in expiring]
        await renewer.renew_blobs(blob_ids, ACCOUNT_NAME)

    logger.info("✅ Expiry Guard cycle complete.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
