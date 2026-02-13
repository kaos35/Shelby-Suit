"""
Basic file upload example for Shelby SDK
Demonstrates simple file upload with progress tracking
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from shelby_sdk import ShelbyClient, ShelbyConfig, UploadManager


async def progress_callback(current: int, total: int):
    """Display upload progress"""
    percent = int((current / total) * 100)
    bar_length = 40
    filled = int(bar_length * current / total)
    bar = "█" * filled + " " * (bar_length - filled)
    print(f"\r[{bar}] {percent}%", end="", flush=True)


async def main():
    """Main upload example"""
    # Initialize client
    config = ShelbyConfig.from_env()
    client = ShelbyClient(config)

    # Check API health
    print("🔍 Checking API health...")
    if not await client.health_check():
        print("❌ API is not healthy")
        return

    print("✅ API is healthy\n")

    # Get file path from command line
    if len(sys.argv) < 2:
        print("Usage: python basic_upload.py <file_path> [account_name]")
        print("\nExample:")
        print("  python basic_upload.py ./my-document.pdf my-account")
        sys.exit(1)

    file_path = sys.argv[1]
    account_name = sys.argv[2] if len(sys.argv) > 2 else "default"

    # Check if file exists
    if not Path(file_path).exists():
        print(f"❌ File not found: {file_path}")
        sys.exit(1)

    print(f"📤 Uploading: {file_path}")
    print(f"👤 Account: {account_name}\n")

    # Create upload manager
    uploader = UploadManager(client)

    # Upload file with progress tracking
    try:
        result = await uploader.upload_file(
            file_path=file_path,
            account_name=account_name,
            metadata={
                "description": "Uploaded via basic_upload.py example",
                "source": "Python SDK",
            },
            progress_callback=progress_callback,
        )

        print(f"\n✅ Upload complete!")
        print(f"   Blob ID: {result.get('blob_id')}")
        print(f"   Hash: {result.get('file_hash')[:16]}...")

    except Exception as e:
        print(f"\n❌ Upload failed: {e}")
        sys.exit(1)

    finally:
        await client.close()


if __name__ == "__main__":
    print("Shelby SDK - Basic Upload Example\n")
    asyncio.run(main())
