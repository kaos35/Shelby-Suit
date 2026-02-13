"""
Tests for Upload Manager
"""

import pytest
import asyncio
import httpx
from pathlib import Path
import tempfile

from shelby_sdk import ShelbyClient, ShelbyConfig, UploadManager, ShelbyUploadError


@pytest.fixture
async def uploader():
    """Fixture for upload manager"""
    config = ShelbyConfig(
        api_url="https://test-api.shelby.io",
        rpc_url="https://test-rpc.shelby.io",
    )
    client = ShelbyClient(config)
    return UploadManager(client)


@pytest.mark.asyncio
async def test_upload_manager_initialization(uploader):
    """Test upload manager initializes correctly"""
    assert uploader is not None
    assert uploader.client is not None


@pytest.mark.asyncio
async def test_upload_file_not_found(uploader):
    """Test upload with non-existent file"""
    with pytest.raises(ShelbyUploadError, match="File not found"):
        await uploader.upload_file(
            file_path="/nonexistent/file.pdf",
            account_name="test-account",
        )


@pytest.mark.asyncio
async def test_upload_file_success(uploader, mocker, test_file):
    """Test successful file upload"""
    # Mock successful responses
    mocker.patch.object(
        uploader.client, "_request",
        side_effect=[
            {"upload_id": "test-upload-123"},  # init response
            {"status": "success"},  # chunk response
            {"blob_id": "test-blob-456", "file_hash": "abcd1234"},  # finalize response
        ],
    )

    result = await uploader.upload_file(
        file_path=test_file,
        account_name="test-account",
    )

    assert result["blob_id"] == "test-blob-456"


@pytest.mark.asyncio
async def test_upload_with_metadata(uploader, mocker, test_file):
    """Test upload with custom metadata"""
    mocker.patch.object(
        uploader.client, "_request",
        return_value={"upload_id": "test-123"},
    )

    await uploader.upload_file(
        file_path=test_file,
        account_name="test-account",
        metadata={
            "description": "Test upload",
            "category": "test",
        },
    )


@pytest.mark.asyncio
async def test_batch_upload(uploader, mocker, test_data_dir):
    """Test batch upload"""
    # Create multiple test files
    files = []
    for i in range(3):
        path = test_data_dir / f"test_{i}.txt"
        path.write_text(f"test content {i}")
        files.append(str(path))

    # Mock responses
    mocker.patch.object(
        uploader.client, "_request",
        return_value={"blob_id": "test-blob"},
    )

    results = await uploader.batch_upload(
        file_paths=files,
        account_name="test-account",
    )

    assert len(results) == 3


# Removed the broken local tmp_path fixture as we use conftest.py fixtures
