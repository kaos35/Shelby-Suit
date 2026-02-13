"""
Blob Management Example for Shelby SDK
Demonstrates listing, searching, deleting, and getting metadata for blobs.
"""

import asyncio
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from shelby_sdk import ShelbyClient, ShelbyConfig, BlobManager


async def main():
    """Main blob management example"""
    # Initialize client
    config = ShelbyConfig.from_env()
    client = ShelbyClient(config)
    
    # Initialize Blob Manager
    blob_manager = BlobManager(client)

    print("🔍 Checking API health...")
    if not await client.health_check():
        print("❌ API is not healthy")
        return

    print("✅ API is healthy\n")

    # 1. List all blobs
    print("📋 Listing recent blobs...")
    try:
        blobs = await blob_manager.list_blobs(limit=10)
        
        if not blobs:
            print("   No blobs found.")
        else:
            print(f"   Found {len(blobs)} blobs:")
            print(f"   {'ID':<20} {'Size (Bytes)':<12} {'Uploaded At':<25}")
            print("   " + "-" * 60)
            
            for blob in blobs:
                uploaded_at = blob.get('uploaded_at', 'Unknown')
                # Format date if possible
                try:
                    dt = datetime.fromisoformat(uploaded_at.replace('Z', '+00:00'))
                    uploaded_at = dt.strftime("%Y-%m-%d %H:%M:%S")
                except:
                    pass
                    
                print(f"   {blob['id'][:18]}.. {blob['size']:<12} {uploaded_at:<25}")

    except Exception as e:
        print(f"❌ Failed to list blobs: {e}")
        return

    if not blobs:
        await client.close()
        return

    # 2. Get Metadata for the first blob
    target_blob_id = blobs[0]['id']
    print(f"\nℹ️  Getting metadata for blob: {target_blob_id}")
    
    try:
        metadata = await blob_manager.get_blob_metadata(target_blob_id)
        print("   Metadata:")
        for key, value in metadata.items():
            print(f"   - {key}: {value}")
            
    except Exception as e:
         print(f"❌ Failed to get metadata: {e}")

    # 3. Check Expiry
    print(f"\n⏳ Checking expiry for blob: {target_blob_id}")
    try:
        expiry = await blob_manager.get_blob_expiry(target_blob_id)
        if expiry:
             print(f"   Expires at: {expiry}")
        else:
             print("   No expiry set (Permanent)")
             
    except Exception as e:
        print(f"❌ Failed to check expiry: {e}")

    # 4. Delete Blob (Optional / Interactive)
    # Be careful with this in a real example, maybe just show the code or ask for confirmation
    # For this example, we won't actually delete to avoid data loss during demos
    print("\n🗑️  Delete Blob Example:")
    print(f"   # await blob_manager.delete_blob('{target_blob_id}')")
    print("   (Delete operation commented out for safety)")

    await client.close()


if __name__ == "__main__":
    print("Shelby SDK - Blob Management Example\n")
    asyncio.run(main())
