import httpx
import logging
from typing import List

class RenewalService:
    def __init__(self, api_url: str):
        self.api_url = api_url
        self.logger = logging.getLogger(__name__)

    async def renew_blobs(self, blob_ids: List[str], account_name: str, extension_days: int = 30):
        """Request renewal for a list of blobs"""
        self.logger.info(f"Attempting to renew {len(blob_ids)} blobs for {account_name}")
        
        results = []
        async with httpx.AsyncClient() as client:
            for blob_id in blob_ids:
                try:
                    # In Shelby protocol, renewal typically involves a POST to /blob/:id/renew
                    response = await client.post(
                        f"{self.api_url}/api/blob/{blob_id}/renew",
                        json={
                            "account": account_name,
                            "days": extension_days
                        }
                    )
                    
                    if response.status_code == 200:
                        self.logger.info(f"Successfully renewed blob {blob_id}")
                        results.append({"id": blob_id, "success": True})
                    else:
                        self.logger.error(f"Failed to renew blob {blob_id}: {response.text}")
                        results.append({"id": blob_id, "success": False, "error": response.text})
                
                except Exception as e:
                    self.logger.error(f"Error during renewal of {blob_id}: {str(e)}")
                    results.append({"id": blob_id, "success": False, "error": str(e)})

        return results
