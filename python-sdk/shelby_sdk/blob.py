"""
Blob module for Shelby SDK
Handles blob storage operations
"""

from typing import Optional, Dict, Any, List
from .client import ShelbyClient
from .exceptions import ShelbyBlobError


class BlobManager:
    """Handle blob operations on Shelby network"""

    def __init__(self, client: ShelbyClient):
        """Initialize blob manager"""
        self.client = client

    async def list_blobs(
        self,
        account_name: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Dict[str, Any]]:
        """List blobs

        Args:
            account_name: Filter by account name
            limit: Maximum number of blobs to return
            offset: Pagination offset

        Returns:
            List of blob metadata
        """
        params = {"limit": limit, "offset": offset}
        if account_name:
            params["account"] = account_name

        response = await self.client._request(
            "GET",
            "blob/list",
            params=params,
            retries=self.client.config.max_retries,
        )

        return response.get("blobs", [])

    async def get_blob(self, blob_id: str) -> Dict[str, Any]:
        """Get blob metadata

        Args:
            blob_id: Blob ID to get

        Returns:
            Blob metadata
        """
        return await self.client._request(
            "GET",
            f"blob/{blob_id}",
            retries=self.client.config.max_retries,
        )

    async def get_blob_metadata(
        self,
        blob_id: str,
        account_name: str,
    ) -> Dict[str, Any]:
        """Get detailed blob metadata

        Args:
            blob_id: Blob ID
            account_name: Account name

        Returns:
            Detailed metadata including expiry, size, hash
        """
        return await self.client._request(
            "GET",
            f"blob/{blob_id}/metadata",
            params={"account": account_name},
            retries=self.client.config.max_retries,
        )

    async def delete_blob(self, blob_id: str, account_name: str) -> bool:
        """Delete a blob

        Args:
            blob_id: Blob ID to delete
            account_name: Account name

        Returns:
            True if successful
        """
        await self.client._request(
            "DELETE",
            f"blob/{blob_id}",
            params={"account": account_name},
            retries=self.client.config.max_retries,
        )
        return True

    async def update_blob_metadata(
        self,
        blob_id: str,
        account_name: str,
        metadata: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update blob metadata

        Args:
            blob_id: Blob ID to update
            account_name: Account name
            metadata: New metadata

        Returns:
            Updated blob metadata
        """
        return await self.client._request(
            "PUT",
            f"blob/{blob_id}/metadata",
            params={"account": account_name},
            data={"metadata": metadata},
            retries=self.client.config.max_retries,
        )

    async def check_blob_expiry(self, blob_id: str) -> Dict[str, Any]:
        """Check if blob is expired or nearing expiry

        Args:
            blob_id: Blob ID to check

        Returns:
            Expiry status with days_remaining
        """
        blob_info = await self.get_blob(blob_id)

        # Calculate expiry (mock - actual implementation depends on API)
        expiry_info = {
            "blob_id": blob_id,
            "is_expired": False,
            "days_remaining": 30,  # Mock value
            "expiry_date": blob_info.get("expiry"),
        }

        return expiry_info
