"""
Upload module for Shelby SDK
"""

import os
import hashlib
from typing import Optional, Dict, Any
from .client import ShelbyClient
from .exceptions import ShelbyUploadError
import asyncio


class UploadManager:
    """Handle file uploads to Shelby network"""

    def __init__(self, client: ShelbyClient):
        """Initialize upload manager"""
        self.client = client
        self.chunk_size = 1024 * 1024  # 1MB chunks

    async def upload_file(
        self,
        file_path: str,
        account_name: str,
        metadata: Optional[Dict[str, Any]] = None,
        progress_callback: Optional[callable] = None,
    ) -> Dict[str, Any]:
        """Upload a file to Shelby network

        Args:
            file_path: Path to file to upload
            account_name: Account name to upload to
            metadata: Optional metadata for the file
            progress_callback: Optional callback for progress updates

        Returns:
            Upload result with blob_id, commitment, etc.
        """
        if not os.path.exists(file_path):
            raise ShelbyUploadError(f"File not found: {file_path}")

        file_size = os.path.getsize(file_path)
        file_name = os.path.basename(file_path)

        # Calculate file hash
        file_hash = await self._hash_file(file_path)

        # Initialize upload
        init_response = await self.client._request(
            "POST",
            "upload/init",
            data={
                "file_name": file_name,
                "file_size": file_size,
                "file_hash": file_hash,
                "account": account_name,
                "metadata": metadata or {},
            },
            retries=self.client.config.max_retries,
        )

        upload_id = init_response.get("upload_id")
        if not upload_id:
            raise ShelbyUploadError("Failed to initialize upload")

        # Upload in chunks
        with open(file_path, "rb") as f:
            chunk_index = 0
            while True:
                chunk = f.read(self.chunk_size)
                if not chunk:
                    break

                await self._upload_chunk(
                    upload_id, chunk, chunk_index, progress_callback
                )
                chunk_index += 1

        # Finalize upload
        final_response = await self.client._request(
            "POST",
            "upload/finalize",
            data={
                "upload_id": upload_id,
                "file_hash": file_hash,
            },
            retries=self.client.config.max_retries,
        )

        return final_response

    async def _upload_chunk(
        self,
        upload_id: str,
        chunk: bytes,
        index: int,
        progress_callback: Optional[callable] = None,
    ):
        """Upload a single chunk"""
        chunk_hash = hashlib.sha256(chunk).hexdigest()

        await self.client._request(
            "POST",
            "upload/chunk",
            data={
                "upload_id": upload_id,
                "chunk_index": index,
                "chunk_data": chunk.hex(),
                "chunk_hash": chunk_hash,
            },
            retries=self.client.config.max_retries,
        )

        if progress_callback:
            await progress_callback(index + 1)

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

    async def batch_upload(
        self,
        file_paths: list[str],
        account_name: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> list[Dict[str, Any]]:
        """Upload multiple files in batch

        Args:
            file_paths: List of file paths to upload
            account_name: Account name to upload to
            metadata: Optional metadata for files

        Returns:
            List of upload results
        """
        results = []
        for file_path in file_paths:
            try:
                result = await self.upload_file(file_path, account_name, metadata)
                results.append({
                    "file": file_path,
                    "status": "success",
                    "result": result,
                })
            except ShelbyUploadError as e:
                results.append({
                    "file": file_path,
                    "status": "failed",
                    "error": str(e),
                })

        return results
