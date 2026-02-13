"""
Data science workflow example for Shelby SDK
Demonstrates upload/download for ML/data science workflows
"""

import asyncio
import sys
import pandas as pd
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from shelby_sdk import ShelbyClient, ShelbyConfig, UploadManager, DownloadManager


async def upload_dataset(
    client: ShelbyClient,
    uploader: UploadManager,
    csv_path: str,
    account_name: str,
) -> str:
    """Upload a dataset (CSV) to Shelby"""
    print(f"📊 Uploading dataset: {csv_path}")

    result = await uploader.upload_file(
        file_path=csv_path,
        account_name=account_name,
        metadata={
            "type": "dataset",
            "format": "csv",
            "source": "data-science-pipeline",
        },
    )

    blob_id = result.get("blob_id")
    print(f"✅ Dataset uploaded! Blob ID: {blob_id}")
    return blob_id


async def download_dataset(
    client: ShelbyClient,
    downloader: DownloadManager,
    blob_id: str,
    output_path: str,
    account_name: str,
):
    """Download a dataset from Shelby"""
    print(f"📥 Downloading dataset to: {output_path}")

    await downloader.download_file(
        blob_id=blob_id,
        output_path=output_path,
        account_name=account_name,
    )

    print(f"✅ Dataset downloaded!")

    # Load with pandas to verify
    df = pd.read_csv(output_path)
    print(f"📊 Dataset loaded: {len(df)} rows, {len(df.columns)} columns")


async def main():
    """Main data science example"""
    config = ShelbyConfig.from_env()
    client = ShelbyClient(config)

    print("🔍 Checking API health...")
    if not await client.health_check():
        print("❌ API is not healthy")
        return

    print("✅ API is healthy\n")

    # Initialize managers
    uploader = UploadManager(client)
    downloader = DownloadManager(client)

    # Example: Upload a dataset
    dataset_path = "./sample_data.csv"

    # Create sample dataset if it doesn't exist
    if not Path(dataset_path).exists():
        print("📝 Creating sample dataset...")
        df = pd.DataFrame({
            "id": range(1, 101),
            "value": [x * 2 for x in range(1, 101)],
            "category": ["A", "B", "C"] * 34,
        })
        df.to_csv(dataset_path, index=False)
        print(f"✅ Sample dataset created: {dataset_path}")

    try:
        # Upload
        account_name = "data-science"
        blob_id = await upload_dataset(client, uploader, dataset_path, account_name)

        print("\n⏳ Waiting 2 seconds before download...")
        await asyncio.sleep(2)

        # Download
        output_path = "./downloaded_data.csv"
        await download_dataset(client, downloader, blob_id, output_path, account_name)

        print(f"\n✅ Data science workflow complete!")
        print(f"   Uploaded: {dataset_path}")
        print(f"   Downloaded: {output_path}")

    except Exception as e:
        print(f"\n❌ Data science workflow failed: {e}")
        sys.exit(1)

    finally:
        await client.close()


if __name__ == "__main__":
    print("Shelby SDK - Data Science Workflow Example\n")
    asyncio.run(main())
