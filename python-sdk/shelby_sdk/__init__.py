"""
Shelby SDK - Python client for Shelby Protocol
A modern, async Python SDK for interacting with the Shelby ecosystem.
"""

from .client import ShelbyClient
from .config import ShelbyConfig
from .upload import UploadManager
from .download import DownloadManager
from .exceptions import (
    ShelbyError,
    ShelbyConnectionError,
    ShelbyUploadError,
    ShelbyDownloadError,
    ShelbyBlobError,
    ShelbyAccountError,
)

__version__ = "0.1.0"
__all__ = [
    "ShelbyClient",
    "ShelbyConfig",
    "UploadManager",
    "DownloadManager",
    "ShelbyError",
    "ShelbyConnectionError",
    "ShelbyUploadError",
    "ShelbyDownloadError",
    "ShelbyBlobError",
    "ShelbyAccountError",
]

__all__.extend([f"shelby_sdk.{name}" for name in __all__])
