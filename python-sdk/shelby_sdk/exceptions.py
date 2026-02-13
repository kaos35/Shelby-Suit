"""
Custom exceptions for Shelby SDK
"""


class ShelbyError(Exception):
    """Base exception for all Shelby SDK errors"""
    pass


class ShelbyConnectionError(ShelbyError):
    """Raised when connection to Shelby API fails"""
    pass


class ShelbyUploadError(ShelbyError):
    """Raised when upload operation fails"""
    pass


class ShelbyDownloadError(ShelbyError):
    """Raised when download operation fails"""
    pass


class ShelbyBlobError(ShelbyError):
    """Raised when blob operation fails"""
    pass


class ShelbyAccountError(ShelbyError):
    """Raised when account operation fails"""
    pass
