"""
Tests for Expiry Guard - Tracker, Alerter, and Renewal
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime, timedelta

from expiry_monitor.tracker import ExpiryTracker
from expiry_monitor.alerter import ExpiryAlerter
from expiry_monitor.renewal import RenewalService
from expiry_monitor.config import Config


class TestExpiryTracker:
    """Tests for ExpiryTracker class"""

    @pytest.fixture
    def tracker(self):
        return ExpiryTracker(api_url="http://localhost:3000", threshold_days=7)

    @pytest.mark.asyncio
    async def test_get_expiring_blobs_returns_expiring(self, tracker):
        """Should return blobs that are expiring within threshold"""
        now = datetime.now()
        expiring_date = (now + timedelta(days=3)).isoformat()
        safe_date = (now + timedelta(days=30)).isoformat()

        mock_blobs = [
            {"id": "blob-1", "fileName": "expire_soon.txt", "expiresAt": expiring_date},
            {"id": "blob-2", "fileName": "safe.txt", "expiresAt": safe_date},
        ]

        mock_resp = MagicMock()
        mock_resp.json.return_value = mock_blobs
        mock_resp.raise_for_status = MagicMock()

        with patch("expiry_monitor.tracker.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.get.return_value = mock_resp
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            result = await tracker.get_expiring_blobs("test-account")
            
            assert len(result) == 1
            assert result[0]["id"] == "blob-1"
            assert result[0]["fileName"] == "expire_soon.txt"

    @pytest.mark.asyncio
    async def test_get_expiring_blobs_handles_error(self, tracker):
        """Should return empty list on API error"""
        with patch("expiry_monitor.tracker.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.get.side_effect = Exception("Connection failed")
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            result = await tracker.get_expiring_blobs("test-account")
            assert result == []

    @pytest.mark.asyncio
    async def test_get_expiring_blobs_skips_missing_dates(self, tracker):
        """Should skip blobs without date fields"""
        mock_blobs = [
            {"id": "blob-1", "fileName": "no_date.txt"},
        ]

        mock_resp = MagicMock()
        mock_resp.json.return_value = mock_blobs
        mock_resp.raise_for_status = MagicMock()

        with patch("expiry_monitor.tracker.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.get.return_value = mock_resp
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            result = await tracker.get_expiring_blobs("test-account")
            assert result == []


class TestExpiryAlerter:
    """Tests for ExpiryAlerter class"""

    @pytest.fixture
    def alerter(self):
        return ExpiryAlerter()

    @pytest.mark.asyncio
    async def test_send_alerts_no_blobs(self, alerter):
        """Should not send alerts when no blobs are expiring"""
        with patch("expiry_monitor.alerter.httpx.AsyncClient") as mock_client:
            await alerter.send_alerts([])
            mock_client.assert_not_called()

    @pytest.mark.asyncio
    async def test_send_alerts_sends_dashboard_alert(self, alerter):
        """Should send HTTP POST to dashboard"""
        blobs = [
            {"id": "b1", "fileName": "f1.txt", "expiresAt": "2026-01-01", "daysLeft": 3},
        ]

        mock_resp = MagicMock()
        mock_resp.status_code = 200

        with patch("expiry_monitor.alerter.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.post.return_value = mock_resp
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            await alerter.send_alerts(blobs)
            instance.post.assert_called_once()


class TestRenewalService:
    """Tests for RenewalService class"""

    @pytest.fixture
    def service(self):
        return RenewalService(api_url="http://localhost:3000")

    @pytest.mark.asyncio
    async def test_renew_blobs_success(self, service):
        """Should return success for each blob renewed"""
        mock_resp = MagicMock()
        mock_resp.status_code = 200

        with patch("expiry_monitor.renewal.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.post.return_value = mock_resp
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            result = await service.renew_blobs(["blob-1", "blob-2"], "test-account")
            
            assert len(result) == 2
            assert result[0]["success"] is True
            assert result[1]["success"] is True

    @pytest.mark.asyncio
    async def test_renew_blobs_failure(self, service):
        """Should handle individual blob renewal failures"""
        mock_resp = MagicMock()
        mock_resp.status_code = 500
        mock_resp.text = "Internal Server Error"

        with patch("expiry_monitor.renewal.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.post.return_value = mock_resp
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            result = await service.renew_blobs(["blob-1"], "test-account")
            
            assert len(result) == 1
            assert result[0]["success"] is False

    @pytest.mark.asyncio
    async def test_renew_blobs_network_error(self, service):
        """Should handle network errors gracefully"""
        with patch("expiry_monitor.renewal.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.post.side_effect = Exception("Network down")
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            result = await service.renew_blobs(["blob-1"], "test-account")
            
            assert len(result) == 1
            assert result[0]["success"] is False
            assert "Network down" in result[0]["error"]


class TestConfig:
    """Tests for Config class"""

    def test_default_values(self):
        """Should have sensible defaults"""
        c = Config()
        assert c.ALERT_DAYS_BEFORE == 7
        assert c.CRITICAL_DAYS_BEFORE == 2
        assert c.LOG_LEVEL == "INFO"
        assert c.DASHBOARD_URL == "http://localhost:3000"
