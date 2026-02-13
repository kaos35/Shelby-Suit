import httpx
import logging
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any

class ExpiryTracker:
    def __init__(self, api_url: str, threshold_days: int = 7):
        self.api_url = api_url
        self.threshold_days = threshold_days
        self.logger = logging.getLogger(__name__)

    async def get_expiring_blobs(self, account_name: str) -> List[Dict[str, Any]]:
        """Fetch blobs that are expiring within the threshold"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.api_url}/api/blob", params={"account": account_name})
                response.raise_for_status()
                all_blobs = response.json()

                expiring = []
                now = datetime.now().astimezone()
                threshold = now + timedelta(days=self.threshold_days)

                for blob in all_blobs:
                    # In a real scenario, we'd have an expiry date in metadata
                    # For now, we simulate by checking the 'uploadedAt' field
                    # or a mock 'expiresAt'
                    expires_at_str = blob.get("expiresAt") or blob.get("uploadedAt")
                    if not expires_at_str:
                        continue
                    
                    try:
                        expires_at = datetime.fromisoformat(expires_at_str.replace("Z", "+00:00"))
                        # Ensure timezone-aware comparison
                        if expires_at.tzinfo is None:
                            expires_at = expires_at.astimezone()
                        if expires_at <= threshold:
                            expiring.append({
                                "id": blob["id"],
                                "fileName": blob.get("fileName", "unknown"),
                                "expiresAt": expires_at_str,
                                "daysLeft": (expires_at - now).days
                            })
                    except ValueError:
                        self.logger.warning(f"Invalid date format for blob {blob['id']}")

                return expiring

        except Exception as e:
            self.logger.error(f"Failed to track expiries: {str(e)}")
            return []
