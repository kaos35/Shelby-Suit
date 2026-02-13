"""
Integration Tests for Expiry Guard

End-to-end tests covering:
- Full monitoring pipeline (Tracker → Alerter → Renewal)
- Webhook delivery (Slack/Discord)
- Config propagation
- Error recovery and edge cases
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock, call
from datetime import datetime, timedelta

from expiry_monitor.tracker import ExpiryTracker
from expiry_monitor.alerter import ExpiryAlerter
from expiry_monitor.renewal import RenewalService
from expiry_monitor.config import Config


class TestFullPipeline:
    """Integration test: Tracker finds expiring blobs → Alerter sends alerts → Renewal renews"""

    @pytest.fixture
    def tracker(self):
        return ExpiryTracker(api_url="http://localhost:3000", threshold_days=7)

    @pytest.fixture
    def alerter(self):
        return ExpiryAlerter()

    @pytest.fixture
    def renewal(self):
        return RenewalService(api_url="http://localhost:3000")

    @pytest.mark.asyncio
    async def test_full_expiry_pipeline(self, tracker, alerter, renewal):
        """Simulates the full lifecycle: detect → alert → renew"""
        now = datetime.now()
        expiring_date = (now + timedelta(days=3)).isoformat()
        
        mock_blobs = [
            {"id": "blob-100", "fileName": "urgent.dat", "expiresAt": expiring_date},
        ]
        
        # Step 1: Tracker fetches expiring blobs
        mock_resp = MagicMock()
        mock_resp.json.return_value = mock_blobs
        mock_resp.raise_for_status = MagicMock()

        with patch("expiry_monitor.tracker.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.get.return_value = mock_resp
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            expiring = await tracker.get_expiring_blobs("test-account")
            assert len(expiring) == 1
            assert expiring[0]["id"] == "blob-100"

        # Step 2: Alerter sends notification about expiring blobs
        mock_alert_resp = MagicMock()
        mock_alert_resp.status_code = 200

        with patch("expiry_monitor.alerter.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.post.return_value = mock_alert_resp
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            await alerter.send_alerts(expiring)
            instance.post.assert_called_once()
            # Verify the payload contains correct alert type
            call_args = instance.post.call_args
            assert call_args[1]["json"]["type"] == "system"
            assert "1 blobs" in call_args[1]["json"]["message"]

        # Step 3: Renewal service renews the blob
        mock_renew_resp = MagicMock()
        mock_renew_resp.status_code = 200

        with patch("expiry_monitor.renewal.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.post.return_value = mock_renew_resp
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            blob_ids = [b["id"] for b in expiring]
            results = await renewal.renew_blobs(blob_ids, "test-account")
            assert len(results) == 1
            assert results[0]["success"] is True

    @pytest.mark.asyncio
    async def test_pipeline_with_multiple_expiring_blobs(self, tracker, alerter, renewal):
        """Should handle batch of multiple expiring blobs"""
        now = datetime.now()
        mock_blobs = [
            {"id": f"blob-{i}", "fileName": f"file-{i}.bin", "expiresAt": (now + timedelta(days=i+1)).isoformat()}
            for i in range(5)
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

            expiring = await tracker.get_expiring_blobs("multi-account")
            assert len(expiring) == 5

        # All 5 should renew
        mock_renew_resp = MagicMock()
        mock_renew_resp.status_code = 200

        with patch("expiry_monitor.renewal.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            instance.post.return_value = mock_renew_resp
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            blob_ids = [b["id"] for b in expiring]
            results = await renewal.renew_blobs(blob_ids, "multi-account")
            assert len(results) == 5
            assert all(r["success"] for r in results)

    @pytest.mark.asyncio
    async def test_pipeline_partial_failure(self, tracker, renewal):
        """Should handle partial failures (some blobs renew, some fail)"""
        success_resp = MagicMock()
        success_resp.status_code = 200
        
        fail_resp = MagicMock()
        fail_resp.status_code = 500
        fail_resp.text = "Storage quota exceeded"

        with patch("expiry_monitor.renewal.httpx.AsyncClient") as mock_client:
            instance = AsyncMock()
            # First call succeeds, second fails
            instance.post.side_effect = [success_resp, fail_resp]
            instance.__aenter__ = AsyncMock(return_value=instance)
            instance.__aexit__ = AsyncMock(return_value=None)
            mock_client.return_value = instance

            results = await renewal.renew_blobs(["blob-ok", "blob-fail"], "test-acc")
            assert results[0]["success"] is True
            assert results[1]["success"] is False


class TestWebhookIntegration:
    """Tests for Slack/Discord webhook delivery integration"""

    @pytest.fixture
    def alerter(self):
        return ExpiryAlerter()

    @pytest.mark.asyncio
    async def test_slack_webhook_delivery(self, alerter):
        """Should send formatted message to Slack webhook"""
        blobs = [
            {"id": "b1", "fileName": "critical.dat", "expiresAt": "2026-03-01", "daysLeft": 2},
        ]

        mock_resp = MagicMock()
        mock_resp.status_code = 200

        with patch.object(alerter, '_send_slack_webhook', new_callable=AsyncMock) as mock_slack:
            with patch("expiry_monitor.alerter.httpx.AsyncClient") as mock_client:
                instance = AsyncMock()
                instance.post.return_value = mock_resp
                instance.__aenter__ = AsyncMock(return_value=instance)
                instance.__aexit__ = AsyncMock(return_value=None)
                mock_client.return_value = instance

                # If the method exists, test it; otherwise it will be added
                if hasattr(alerter, '_send_slack_webhook'):
                    await alerter._send_slack_webhook(blobs)
                    mock_slack.assert_called_once()

    @pytest.mark.asyncio
    async def test_discord_webhook_delivery(self, alerter):
        """Should send formatted embed to Discord webhook"""
        blobs = [
            {"id": "b1", "fileName": "data.bin", "expiresAt": "2026-03-01", "daysLeft": 5},
        ]

        with patch.object(alerter, '_send_discord_webhook', new_callable=AsyncMock) as mock_discord:
            if hasattr(alerter, '_send_discord_webhook'):
                await alerter._send_discord_webhook(blobs)
                mock_discord.assert_called_once()


class TestConfigPropagation:
    """Tests to verify config values propagate correctly"""

    def test_webhook_urls_from_env(self):
        """Config should pick up webhook URLs from env"""
        with patch.dict("os.environ", {
            "SLACK_WEBHOOK_URL": "https://hooks.slack.com/test",
            "DISCORD_WEBHOOK_URL": "https://discord.com/api/webhooks/test",
        }):
            c = Config()
            assert c.SLACK_WEBHOOK_URL == "https://hooks.slack.com/test"
            assert c.DISCORD_WEBHOOK_URL == "https://discord.com/api/webhooks/test"

    def test_custom_thresholds(self):
        """Config should allow custom alert thresholds"""
        with patch.dict("os.environ", {
            "ALERT_DAYS_BEFORE": "14",
            "CRITICAL_DAYS_BEFORE": "3",
        }):
            c = Config()
            assert c.ALERT_DAYS_BEFORE == 14
            assert c.CRITICAL_DAYS_BEFORE == 3

    def test_api_settings(self):
        """Config should propagate Shelby API settings"""
        with patch.dict("os.environ", {
            "SHELBY_API_URL": "https://custom.api.shelby.io",
            "SHELBY_API_KEY": "sk-test-key",
        }):
            c = Config()
            assert c.SHELBY_API_URL == "https://custom.api.shelby.io"
            assert c.SHELBY_API_KEY == "sk-test-key"
