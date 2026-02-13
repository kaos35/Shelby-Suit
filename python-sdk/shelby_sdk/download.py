"""
Download module for Shelby SDK
"""

import os
import hashlib
from typing import Optional, Dict, Any
from .client import ShelbyClient
from .exceptions import ShelbyDownloadError
import asyncio


class DownloadManager:
    """Handle file downloads from Shelby network"""

    def __init__(self, client: ShelbyClient):
        """Initialize download manager"""
        self.client = client
        self.chunk_size = 1024 * 1024  # 1MB chunks

    async def download_file(
        self,
        blob_id: str,
        output_path: str,
        account_name: str,
        progress_callback: Optional[callable] = None,
    ) -> str:
        """Download a file from Shelby network

        Args:
            blob_id: Blob ID to download
            output_path: Where to save the file
            account_name: Account name to download from
            progress_callback: Optional callback for progress updates

        Returns:
            Path to downloaded file
        """
        # Get blob metadata
        blob_info = await self.client._request(
            "GET",
            f"blob/{blob_id}",
            retries=self.client.config.max_retries,
        )

        file_size = blob_info.get("size", 0)
        file_hash = blob_info.get("hash", "")
        chunks = blob_info.get("chunks", [])

        # Create output directory if needed
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Download chunks and assemble
        with open(output_path, "wb") as f:
            for chunk_info in chunks:
                chunk_data = await self._download_chunk(
                    blob_id, chunk_info["index"], account_name
                )
                f.seek(chunk_info["offset"])
                f.write(chunk_data)

                if progress_callback:
                    await progress_callback(
                        chunk_info["index"] + 1, len(chunks)
                    )

        # Verify hash
        downloaded_hash = await self._hash_file(output_path)
        if downloaded_hash != file_hash:
            os.remove(output_path)
            raise ShelbyDownloadError(
                f"Hash mismatch: expected {file_hash}, got {downloaded_hash}"
            )

        return output_path

    async def _download_chunk(
        self,
        blob_id: str,
        chunk_index: int,
        account_name: str,
    ) -> bytes:
        """Download a single chunk"""
        response = await self.client._request(
            "GET",
            f"blob/{blob_id}/chunk/{chunk_index}",
            data={"account": account_name},
            retries=self.client.config.max_retries,
        )

        chunk_data = response.get("data")
        chunk_hash = response.get("hash")

        # Verify chunk hash
        calculated_hash = hashlib.sha256(bytes.fromhex(chunk_data)).hexdigest()
        if calculated_hash != chunk_hash:
            raise ShelbyDownloadError(f"Chunk {chunk_index} hash mismatch")

        return bytes.fromhex(chunk_data)

    async def _hash_file(self, file_path: str) -> str:
        """Calculate SHA-256 hash of file"""
        sha256 = hashlib.sha256()

        with open(file_path, "rb") as f:
            while True:
                data = f.read(65536)  # 64KB chunks
                if not data:
                    break
                sha256.update(data)

        return sha256.hexdigest()

    async def batch_download(
        self,
        blob_ids: list[str],
        output_dir: str,
        account_name: str,
    ) -> list[Dict[str, Any]]:
        """Download multiple files in batch

        Args:
            blob_ids: List of blob IDs to download
            output_dir: Directory to save files
            account_name: Account name to download from

        Returns:
            List of download results
        """
        results = []
        for blob_id in blob_ids:
            try:
                # Get blob info for filename
                blob_info = await self.client._request(
                    "GET",
                    f"blob/{blob_id}",
                    retries=self.client.config.max_retries,
                )
                file_name = blob_info.get("metadata", {}).get("name", blob_id)
                output_path = os.path.join(output_dir, file_name)

                result = await self.download_file(blob_id, output_path, account_name)
                results.append({
                    "blob_id": blob_id,
                    "status": "success",
                    "path": result,
                })
            except ShelbyDownloadError as e:
                results.append({
                    "blob_id": blob_id,
                    "status": "failed",
                    "error": str(e),
                })

        return results
