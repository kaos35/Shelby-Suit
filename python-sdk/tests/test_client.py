"""
Tests for Shelby Client
"""

import pytest
import httpx
from shelby_sdk import ShelbyClient, ShelbyConfig, ShelbyConnectionError


@pytest.fixture
async def client():
    """Fixture for test client"""
    config = ShelbyConfig(
        api_url="https://test-api.shelby.io",
        rpc_url="https://test-rpc.shelby.io",
        timeout=5,
        max_retries=2,
    )
    return ShelbyClient(config)


@pytest.mark.asyncio
async def test_client_initialization(client):
    """Test client initializes correctly"""
    assert client is not None
    assert client.config.api_url == "https://test-api.shelby.io"
    assert client.config.timeout == 5


@pytest.mark.asyncio
async def test_health_check_success(client, mocker):
    """Test successful health check"""
    # Mock successful response
    mock_response = mocker.Mock()
    mock_response.status_code = 200

    mocker.patch.object(
        client.session, "get", return_value=mock_response
    )

    result = await client.health_check()
    assert result is True


@pytest.mark.asyncio
async def test_health_check_failure(client, mocker):
    """Test failed health check"""
    # Mock failed response
    mocker.patch.object(
        client.session, "get", side_effect=httpx.RequestError("Connection error")
    )

    result = await client.health_check()
    assert result is False


@pytest.mark.asyncio
async def test_get_stats(client, mocker):
    """Test getting platform stats"""
    mock_response = mocker.Mock()
    mock_response.json.return_value = {
        "total_uploads": 100,
        "active_accounts": 5,
        "network_health": "98%",
    }

    mocker.patch.object(
        client.session, "get", return_value=mock_response
    )

    stats = await client.get_stats()
    assert stats["total_uploads"] == 100
    assert stats["active_accounts"] == 5


@pytest.mark.asyncio
async def test_connection_error(client, mocker):
    """Test connection error handling"""
    mocker.patch.object(
        client.session, "get",
        side_effect=httpx.HTTPStatusError(
            "Server error",
            request=mocker.Mock(spec=httpx.Request),
            response=mocker.Mock(status_code=500)
        ),
    )

    with pytest.raises(ShelbyConnectionError):
        await client._request("GET", "test", retries=1)


@pytest.mark.asyncio
async def test_client_close(client):
    """Test client closes session"""
    await client.close()
    assert client.session.is_closed
