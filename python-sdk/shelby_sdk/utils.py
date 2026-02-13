"""
Utility functions for Shelby SDK
"""

import os
import json
from typing import Dict, Any, Optional
from pathlib import Path


def ensure_config_dir() -> Path:
    """Ensure configuration directory exists"""
    config_dir = Path.home() / ".shelby"
    config_dir.mkdir(exist_ok=True)
    return config_dir


def load_config(config_path: Optional[str] = None) -> Dict[str, Any]:
    """Load configuration from file

    Args:
        config_path: Path to config file (optional)

    Returns:
        Configuration dictionary
    """
    if config_path and os.path.exists(config_path):
        with open(config_path, "r") as f:
            return json.load(f)

    # Return default config
    return {
        "api_url": "https://api.shelby.io",
        "rpc_url": "https://rpc.shelby.io",
        "timeout": 30,
        "max_retries": 3,
        "verify_ssl": True,
    }


def save_config(config: Dict[str, Any], config_path: str) -> None:
    """Save configuration to file

    Args:
        config: Configuration dictionary
        config_path: Path to save config
    """
    config_dir = os.path.dirname(config_path)
    if config_dir:
        os.makedirs(config_dir, exist_ok=True)

    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)


def format_size(bytes_size: int) -> str:
    """Format byte size to human readable

    Args:
        bytes_size: Size in bytes

    Returns:
        Formatted size string
    """
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if abs(bytes_size) < 1024.0:
            return f"{bytes_size:.2f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.2f} PB"


def truncate_hash(hash_string: str, length: int = 8) -> str:
    """Truncate hash for display

    Args:
        hash_string: Full hash string
        length: Characters to show

    Returns:
        Truncated hash with ellipsis
    """
    if len(hash_string) <= length:
        return hash_string
    return f"{hash_string[:length]}..."


def validate_file_path(file_path: str) -> bool:
    """Validate file path exists and is readable

    Args:
        file_path: Path to validate

    Returns:
        True if valid
    """
    return os.path.exists(file_path) and os.path.isfile(file_path)


def get_file_extension(file_path: str) -> str:
    """Get file extension from path

    Args:
        file_path: File path

    Returns:
        File extension without dot
    """
    return os.path.splitext(file_path)[1].lstrip(".")


def create_progress_bar(current: int, total: int, width: int = 50) -> str:
    """Create ASCII progress bar

    Args:
        current: Current progress
        total: Total items
        width: Bar width in characters

    Returns:
        Progress bar string
    """
    if total == 0:
        return " " * width

    progress = current / total
    filled = int(width * progress)
    bar = "█" * filled + " " * (width - filled)
    percent = int(progress * 100)

    return f"[{bar}] {percent}%"
