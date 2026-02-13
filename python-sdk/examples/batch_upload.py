"""
Batch file upload example for Shelby SDK
Demonstrates uploading multiple files efficiently
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from shelby_sdk import ShelbyClient, ShelbyConfig, UploadManager


async def main():
    """Main batch upload example"""
    # Initialize client
    config = ShelbyConfig.from_env()
    client = ShelbyClient(config)

    print("🔍 Checking API health...")
    if not await client.health_check():
        print("❌ API is not healthy")
        return

    print("✅ API is healthy\n")

    # Get directory from command line
    if len(sys.argv) < 2:
        print("Usage: python batch_upload.py <directory> [account_name]")
        print("\nExample:")
        print("  python batch_upload.py ./files my-account")
        sys.exit(1)

    dir_path = Path(sys.argv[1])
    account_name = sys.argv[2] if len(sys.argv) > 2 else "default"

    if not dir_path.exists() or not dir_path.is_dir():
        print(f"❌ Directory not found: {dir_path}")
        sys.exit(1)

    # Find all files in directory
    files = [
        str(f)
        for f in dir_path.iterdir()
        if f.is_file() and not f.name.startswith(".")
    ]

    if not files:
        print(f"❌ No files found in {dir_path}")
        sys.exit(1)

    print(f"📦 Found {len(files)} files to upload")
    print(f"👤 Account: {account_name}\n")

    # Create upload manager
    uploader = UploadManager(client)

    # Batch upload all files
    try:
        results = await uploader.batch_upload(
            file_paths=files,
            account_name=account_name,
            metadata={
                "batch_job": "batch_upload.py example",
                "source": "Python SDK",
            },
        )

        # Display results
        successful = sum(1 for r in results if r["status"] == "success")
        failed = len(results) - successful

        print(f"\n📊 Upload Summary:")
        print(f"   ✅ Successful: {successful}")
        print(f"   ❌ Failed: {failed}")
        print(f"   📈 Total: {len(results)}")

        # Show details for failed uploads
        if failed > 0:
            print(f"\n❌ Failed uploads:")
            for result in results:
                if result["status"] == "failed":
                    print(f"   - {result['file']}: {result.get('error', 'Unknown error')}")

    except Exception as e:
        print(f"\n❌ Batch upload failed: {e}")
        sys.exit(1)

    finally:
        await client.close()


if __name__ == "__main__":
    print("Shelby SDK - Batch Upload Example\n")
    asyncio.run(main())
