"""
Main Shelby SDK Client
"""

import httpx
from typing import Optional, Dict, Any
from .config import ShelbyConfig
from .exceptions import ShelbyConnectionError, ShelbyError
import json


class ShelbyClient:
    """Main client for interacting with Shelby Protocol"""

    def __init__(self, config: ShelbyConfig):
        """Initialize the Shelby client"""
        self.config = config
        self.session = httpx.AsyncClient(
            timeout=config.timeout,
            verify=config.verify_ssl,
        )

    async def _request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        retries: int = 0,
    ) -> Dict[str, Any]:
        """Make HTTP request with retry logic"""
        url = f"{self.config.api_url}/{endpoint.lstrip('/')}"

        for attempt in range(retries + 1):
            try:
                if method.upper() == "GET":
                    response = await self.session.get(url, params=data)
                elif method.upper() == "POST":
                    response = await self.session.post(url, json=data)
                elif method.upper() == "PUT":
                    response = await self.session.put(url, json=data)
                elif method.upper() == "DELETE":
                    response = await self.session.delete(url)
                else:
                    raise ShelbyError(f"Unsupported method: {method}")

                response.raise_for_status()
                return response.json()

            except httpx.HTTPStatusError as e:
                if attempt == retries:
                    raise ShelbyConnectionError(
                        f"Request failed after {retries} retries: {e}"
                    )
                await asyncio.sleep(2 ** attempt)

            except httpx.RequestError as e:
                if attempt == retries:
                    raise ShelbyConnectionError(
                        f"Connection error after {retries} retries: {e}"
                    )
                await asyncio.sleep(2 ** attempt)

    async def health_check(self) -> bool:
        """Check if the API is healthy"""
        try:
            response = await self.session.get(f"{self.config.api_url}/health")
            return response.status_code == 200
        except Exception:
            return False

    async def get_stats(self) -> Dict[str, Any]:
        """Get platform statistics"""
        return await self._request("GET", "stats")

    async def close(self):
        """Close the HTTP session"""
        await self.session.aclose()


# Required at module level for async/await
import asyncio
