"""
Tests for Download Manager
"""

import pytest
import httpx

from shelby_sdk import ShelbyClient, ShelbyConfig, DownloadManager, ShelbyDownloadError


@pytest.fixture
async def downloader():
    """Fixture for download manager"""
    config = ShelbyConfig(
        api_url="https://test-api.shelby.io",
        rpc_url="https://test-rpc.shelby.io",
    )
    client = ShelbyClient(config)
    return DownloadManager(client)


@pytest.mark.asyncio
async def test_download_manager_initialization(downloader):
    """Test download manager initializes correctly"""
    assert downloader is not None
    assert downloader.client is not None


@pytest.mark.asyncio
async def test_download_file_success(downloader, mocker, test_data_dir):
    """Test successful file download"""
    output_path = test_data_dir / "download_success.txt"
    # Mock blob info response
    mocker.patch.object(
        downloader.client, "_request",
        return_value={
            "size": 1024,
            "hash": "test-hash-1234",
            "chunks": [
                {"index": 0, "offset": 0, "hash": "chunk0"},
            ],
        },
    )

    # Mock chunk download
    mocker.patch.object(
        downloader,
        "_download_chunk",
        return_value=b"00" * 512,  # Mock chunk data
    )

    # Mock hash calculation
    mocker.patch.object(
        downloader,
        "_hash_file",
        return_value="test-hash-1234",
    )

    await downloader.download_file(
        blob_id="test-blob-123",
        output_path=str(output_path),
        account_name="test-account",
    )

    assert output_path.exists()


@pytest.mark.asyncio
async def test_download_hash_mismatch(downloader, mocker, test_data_dir):
    """Test download with hash mismatch"""
    output_path = test_data_dir / "download_mismatch.txt"
    # Mock blob info
    mocker.patch.object(
        downloader.client, "_request",
        return_value={
            "size": 1024,
            "hash": "correct-hash",
            "chunks": [
                {"index": 0, "offset": 0, "hash": "chunk0"},
            ],
        },
    )

    # Mock chunk download
    mocker.patch.object(
        downloader,
        "_download_chunk",
        return_value=b"00" * 512,
    )

    # Mock hash calculation with wrong value
    mocker.patch.object(
        downloader,
        "_hash_file",
        return_value="wrong-hash",
    )

    with pytest.raises(ShelbyDownloadError, match="Hash mismatch"):
        await downloader.download_file(
            blob_id="test-blob-123",
            output_path=str(output_path),
            account_name="test-account",
        )


@pytest.mark.asyncio
async def test_batch_download(downloader, mocker, test_data_dir):
    """Test batch download"""
    blob_ids = ["blob-1", "blob-2", "blob-3"]

    # Mock successful downloads
    mocker.patch.object(
        downloader,
        "download_file",
        return_value=str(test_data_dir / "batch_test.txt"),
    )

    # Mock blob info for batch download to get filename
    mocker.patch.object(
        downloader.client, "_request",
        return_value={"metadata": {"name": "test.txt"}},
    )

    results = await downloader.batch_download(
        blob_ids=blob_ids,
        output_dir=str(test_data_dir),
        account_name="test-account",
    )

    assert len(results) == 3
    assert all(r["status"] == "success" for r in results)


@pytest.mark.asyncio
async def test_download_with_progress(downloader, mocker, test_data_dir):
    """Test download with progress callback"""
    output_path = test_data_dir / "download_progress.txt"
    progress_updates = []

    async def mock_progress(current, total):
        progress_updates.append((current, total))

    # Mock responses
    mocker.patch.object(
        downloader.client, "_request",
        return_value={"size": 1024, "hash": "test", "chunks": [{"index": 0, "offset": 0}]},
    )
    mocker.patch.object(downloader, "_download_chunk", return_value=b"00" * 512)
    mocker.patch.object(downloader, "_hash_file", return_value="test")

    await downloader.download_file(
        blob_id="test-blob",
        output_path=str(output_path),
        account_name="test-account",
        progress_callback=mock_progress,
    )

    assert len(progress_updates) > 0
