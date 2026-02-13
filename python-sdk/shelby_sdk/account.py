"""
Account module for Shelby SDK
Handles account operations
"""

from typing import Optional, Dict, Any, List
from .client import ShelbyClient
from .exceptions import ShelbyAccountError


class AccountManager:
    """Handle account operations on Shelby network"""

    def __init__(self, client: ShelbyClient):
        """Initialize account manager"""
        self.client = client

    async def list_accounts(self) -> List[Dict[str, Any]]:
        """List all accounts

        Returns:
            List of account information
        """
        response = await self.client._request(
            "GET",
            "account/list",
            retries=self.client.config.max_retries,
        )

        return response.get("accounts", [])

    async def get_account(self, account_name: str) -> Dict[str, Any]:
        """Get account details

        Args:
            account_name: Account name

        Returns:
            Account details including balance, address
        """
        return await self.client._request(
            "GET",
            f"account/{account_name}",
            retries=self.client.config.max_retries,
        )

    async def get_balance(self, account_name: str) -> Dict[str, Any]:
        """Get account balance

        Args:
            account_name: Account name

        Returns:
            Balance information
        """
        response = await self.client._request(
            "GET",
            f"account/{account_name}/balance",
            retries=self.client.config.max_retries,
        )

        return {
            "account": account_name,
            "balance": response.get("balance", 0),
            "address": response.get("address"),
            "currency": response.get("currency", "SHELBY"),
        }

    async def get_address(self, account_name: str) -> str:
        """Get account address

        Args:
            account_name: Account name

        Returns:
            Account address
        """
        account = await self.get_account(account_name)
        return account.get("address", "")

    async def fund_account(
        self,
        account_name: str,
        amount: float,
        currency: str = "SHELBY",
    ) -> Dict[str, Any]:
        """Fund an account (mock - requires actual funding method)

        Args:
            account_name: Account to fund
            amount: Amount to fund
            currency: Currency code

        Returns:
            Funding transaction result
        """
        # This would integrate with actual funding mechanism
        return await self.client._request(
            "POST",
            f"account/{account_name}/fund",
            data={"amount": amount, "currency": currency},
            retries=self.client.config.max_retries,
        )

    async def create_account(
        self,
        account_name: str,
        account_type: str = "standard",
    ) -> Dict[str, Any]:
        """Create a new account

        Args:
            account_name: Name for new account
            account_type: Type of account to create

        Returns:
            New account details
        """
        return await self.client._request(
            "POST",
            "account/create",
            data={
                "name": account_name,
                "type": account_type,
            },
            retries=self.client.config.max_retries,
        )

    async def get_account_history(
        self,
        account_name: str,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """Get account transaction history

        Args:
            account_name: Account name
            limit: Maximum transactions to return

        Returns:
            List of transactions
        """
        response = await self.client._request(
            "GET",
            f"account/{account_name}/history",
            params={"limit": limit},
            retries=self.client.config.max_retries,
        )

        return response.get("transactions", [])
