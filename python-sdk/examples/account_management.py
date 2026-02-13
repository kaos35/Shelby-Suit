"""
Account Management Example for Shelby SDK
Demonstrates creating accounts, checking balances, and funding.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from shelby_sdk import ShelbyClient, ShelbyConfig, AccountManager


async def main():
    """Main account management example"""
    # Initialize client
    config = ShelbyConfig.from_env()
    client = ShelbyClient(config)
    
    # Initialize Account Manager
    account_manager = AccountManager(client)

    print("🔍 Checking API health...")
    if not await client.health_check():
        print("❌ API is not healthy")
        return

    print("✅ API is healthy\n")

    # 1. Create a new account
    print("👤 Creating a new account...")
    try:
        new_account_name = f"demo-user-{int(datetime.now().timestamp())}"
        account = await account_manager.create_account(
            name=new_account_name,
            initial_balance=1000  # Faucet amount
        )
        print(f"   ✅ Created: {account['name']}")
        print(f"      ID: {account['id']}")
        print(f"      Address: {account['address']}")
        print(f"      Balance: {account['balance']} SHELBY")
        
        # Store for next steps
        target_account = account
        
    except Exception as e:
        print(f"❌ Failed to create account: {e}")
        # Try to continue with a default account if creation fails
        target_account = {'name': 'default'}

    # 2. Check Balance
    print(f"\n💰 Checking balance for: {target_account['name']}")
    try:
        balance = await account_manager.get_balance(target_account['name'])
        print(f"   Balance: {balance} SHELBY")
        
        # Also check address just in case
        address = await account_manager.get_address(target_account['name'])
        print(f"   Address: {address}")
        
    except Exception as e:
        print(f"❌ Failed to get balance: {e}")

    # 3. Fund Account (Faucet)
    amount = 500
    print(f"\n💸 Adding funds ({amount} SHELBY) via faucet...")
    try:
        new_balance = await account_manager.fund_account(target_account['name'], amount)
        print(f"   ✅ Success! New Balance: {new_balance} SHELBY")
        
    except Exception as e:
        print(f"❌ Failed to fund account: {e}")

    # 4. List Accounts (if supported by API/SDK)
    # The API might not expose a list all method for security, but checking if available
    # print("\n📋 Listing accounts (admin)...")
    # try:
    #     accounts = await account_manager.list_accounts()
    #     for acc in accounts:
    #         print(f"   - {acc['name']}: {acc['balance']}")
    # except:
    #     print("   (List accounts not supported or unauthorized)")

    await client.close()


if __name__ == "__main__":
    from datetime import datetime
    print("Shelby SDK - Account Management Example\n")
    asyncio.run(main())
