"""
Configuration module for Shelby SDK
"""

from dataclasses import dataclass
from typing import Optional
import os
import yaml


@dataclass
class ShelbyConfig:
    """Configuration for Shelby SDK client"""

    api_url: str
    rpc_url: str
    timeout: int = 30
    max_retries: int = 3
    verify_ssl: bool = True

    @classmethod
    def from_env(cls) -> "ShelbyConfig":
        """Load configuration from environment variables"""
        return cls(
            api_url=os.getenv("SHELBY_API_URL", "https://api.shelby.io"),
            rpc_url=os.getenv("SHELBY_RPC_URL", "https://rpc.shelby.io"),
            timeout=int(os.getenv("SHELBY_TIMEOUT", "30")),
            max_retries=int(os.getenv("SHELBY_MAX_RETRIES", "3")),
            verify_ssl=os.getenv("SHELBY_VERIFY_SSL", "true").lower() == "true",
        )

    @classmethod
    def from_file(cls, path: str) -> "ShelbyConfig":
        """Load configuration from YAML file"""
        with open(path, "r") as f:
            data = yaml.safe_load(f)
            return cls(**data)

    def to_file(self, path: str) -> None:
        """Save configuration to YAML file"""
        with open(path, "w") as f:
            yaml.dump({
                "api_url": self.api_url,
                "rpc_url": self.rpc_url,
                "timeout": self.timeout,
                "max_retries": self.max_retries,
                "verify_ssl": self.verify_ssl,
            }, f)
