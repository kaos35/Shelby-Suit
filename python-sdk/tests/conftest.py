"""
Pytest configuration for Shelby SDK tests
"""

import pytest
import sys
from pathlib import Path


def pytest_configure(config):
    """Configure pytest with custom markers"""
    config.addinivalue_line(
        "markers",
        "asyncio: mark test as async",
    )


@pytest.fixture
def test_data_dir(tmp_path_factory):
    """Create a temporary directory for test data"""
    return tmp_path_factory.mktemp("shelby_test_data")


@pytest.fixture
def test_file(test_data_dir):
    """Create a temporary test file"""
    file_path = test_data_dir / "test_file.txt"
    file_path.write_text("Test content for upload")
    return str(file_path)
