"""
Setup script for Shelby SDK
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read README for long description
readme_file = Path(__file__).parent / "README.md"
long_description = ""
if readme_file.exists():
    with open(readme_file, "r", encoding="utf-8") as f:
        long_description = f.read()

setup(
    name="shelby-sdk",
    version="0.1.0",
    author="Shelby Ecosystem",
    author_email="dev@shelby.io",
    description="Python SDK for Shelby Protocol - Modern file storage and account management",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/shelby-ecosystem/python-sdk",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    keywords="shelby sdk storage upload download blob account",
    python_requires=">=3.11",
    install_requires=[
        "httpx>=0.27.0",
        "pyyaml>=6.0",
        "aiofiles>=23.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0",
            "pytest-asyncio>=0.21.0",
            "black>=23.0",
            "mypy>=1.5",
            "ruff>=0.1.0",
        ],
    },
)
