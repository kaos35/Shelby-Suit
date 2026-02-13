# Shelby SDK - Python Client for Shelby Protocol

[![Python Version](https://img.shields.io/badge/python-3.11%20%7C3.12-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Development Status](https://img.shields.io/badge/status--alpha-orange.svg)](https://github.com/shelby-ecosystem/python-sdk)

A modern, async Python SDK for interacting with the Shelby Protocol ecosystem - including file storage, account management, and blob operations.

## Features

- ✅ **Async/Await** - Built on `httpx` and `asyncio` for modern async operations
- ✅ **File Upload** - Chunked file uploads with progress tracking and hash verification
- ✅ **File Download** - Chunked downloads with integrity verification
- ✅ **Account Management** - Create accounts, check balances, manage addresses
- ✅ **Blob Operations** - List, get metadata, delete blobs
- ✅ **Batch Operations** - Upload/download multiple files efficiently
- ✅ **Configuration** - YAML and environment variable support
- ✅ **Error Handling** - Custom exception hierarchy for better error management

## Installation

```bash
# Install from PyPI (when published)
pip install shelby-sdk

# Or install from source
pip install -e .
```

## Quick Start

### Basic Usage

```python
import asyncio
from shelby_sdk import ShelbyClient, ShelbyConfig

async def main():
    # Initialize client
    config = ShelbyConfig(
        api_url="https://api.shelby.io",
        rpc_url="https://rpc.shelby.io",
    )

    client = ShelbyClient(config)

    # Health check
    if await client.health_check():
        print("✅ Shelby API is healthy")

    # Get stats
    stats = await client.get_stats()
    print(f"Stats: {stats}")

    await client.close()

asyncio.run(main())
```

### File Upload

```python
from shelby_sdk import ShelbyClient, UploadManager
import asyncio

async def upload_file():
    client = ShelbyClient(config)

    uploader = UploadManager(client)

    result = await uploader.upload_file(
        file_path="./my-document.pdf",
        account_name="my-account",
        metadata={"description": "Important document"},
        progress_callback=lambda current, total: print(f"{current}/{total} chunks"),
    )

    print(f"Upload complete: {result['blob_id']}")

asyncio.run(upload_file())
```

### File Download

```python
from shelby_sdk import ShelbyClient, DownloadManager
import asyncio

async def download_file():
    client = ShelbyClient(config)

    downloader = DownloadManager(client)

    await downloader.download_file(
        blob_id="abc123...",
        output_path="./downloaded-file.pdf",
        account_name="my-account",
        progress_callback=lambda current, total: print(f"{current}/{total} chunks"),
    )

    print("Download complete!")

asyncio.run(download_file())
```

### Account Management

```python
from shelby_sdk import ShelbyClient, AccountManager
import asyncio

async def manage_accounts():
    client = ShelbyClient(config)

    account_mgr = AccountManager(client)

    # List all accounts
    accounts = await account_mgr.list_accounts()
    for acc in accounts:
        print(f"{acc['name']}: {acc['balance']} SHELBY")

    # Get account balance
    balance = await account_mgr.get_balance("my-account")
    print(f"Balance: {balance['balance']} {balance['currency']}")

    # Get account address
    address = await account_mgr.get_address("my-account")
    print(f"Address: {address}")

asyncio.run(manage_accounts())
```

### Batch Operations

```python
from shelby_sdk import ShelbyClient, UploadManager
import asyncio

async def batch_upload():
    client = ShelbyClient(config)

    uploader = UploadManager(client)

    files = [
        "./document1.pdf",
        "./document2.pdf",
        "./image.png",
    ]

    results = await uploader.batch_upload(
        file_paths=files,
        account_name="my-account",
    )

    for result in results:
        status = "✅" if result["status"] == "success" else "❌"
        print(f"{status} {result['file']}: {result.get('error', 'OK')}")

asyncio.run(batch_upload())
```

## Configuration

### Environment Variables

```bash
export SHELBY_API_URL="https://api.shelby.io"
export SHELBY_RPC_URL="https://rpc.shelby.io"
export SHELBY_TIMEOUT="30"
export SHELBY_MAX_RETRIES="3"
export SHELBY_VERIFY_SSL="true"
```

### YAML Configuration

Create `~/.shelby/config.yaml`:

```yaml
api_url: "https://api.shelby.io"
rpc_url: "https://rpc.shelby.io"
timeout: 30
max_retries: 3
verify_ssl: true
```

```python
from shelby_sdk import ShelbyConfig

# Load from file
config = ShelbyConfig.from_file("~/.shelby/config.yaml")

# Or load from environment
config = ShelbyConfig.from_env()
```

## API Reference

### ShelbyClient

Main client for all Shelby operations.

**Methods:**
- `health_check()` - Check API health
- `get_stats()` - Get platform statistics
- `close()` - Close HTTP session

### UploadManager

Handle file uploads to Shelby network.

**Methods:**
- `upload_file(file_path, account_name, metadata, progress_callback)` - Upload single file
- `batch_upload(file_paths, account_name, metadata)` - Batch upload files

### DownloadManager

Handle file downloads from Shelby network.

**Methods:**
- `download_file(blob_id, output_path, account_name, progress_callback)` - Download single file
- `batch_download(blob_ids, output_dir, account_name)` - Batch download files

### AccountManager

Handle account operations on Shelby network.

**Methods:**
- `list_accounts()` - List all accounts
- `get_account(account_name)` - Get account details
- `get_balance(account_name)` - Get account balance
- `get_address(account_name)` - Get account address
- `fund_account(account_name, amount, currency)` - Fund account (mock)
- `create_account(account_name, account_type)` - Create new account
- `get_account_history(account_name, limit)` - Get transaction history

### BlobManager

Handle blob operations on Shelby network.

**Methods:**
- `list_blobs(account_name, limit, offset)` - List blobs
- `get_blob(blob_id)` - Get blob metadata
- `get_blob_metadata(blob_id, account_name)` - Get detailed blob metadata
- `delete_blob(blob_id, account_name)` - Delete blob
- `update_blob_metadata(blob_id, account_name, metadata)` - Update metadata
- `check_blob_expiry(blob_id)` - Check expiry status

## Examples

See `examples/` directory for more examples:

- `basic_upload.py` - Basic file upload
- `batch_upload.py` - Batch file upload
- `data_science.py` - Upload/download for data science workflows

## Testing

```bash
# Install test dependencies
pip install -e ".[dev]"

# Run tests
pytest tests/

# With coverage
pytest tests/ --cov=shelby_sdk --cov-report=html
```

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions welcome! Please see CONTRIBUTING.md for guidelines.

## Support

- **Documentation**: https://shelby.io/docs/python-sdk
- **Issues**: https://github.com/shelby-ecosystem/python-sdk/issues
- **Discord**: https://discord.gg/shelby
