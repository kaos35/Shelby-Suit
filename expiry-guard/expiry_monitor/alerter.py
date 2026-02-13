import logging
import httpx
from typing import List, Dict, Any
from .config import config


class ExpiryAlerter:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    async def send_alerts(self, expiring_blobs: List[Dict[str, Any]]):
        if not expiring_blobs:
            self.logger.info("No expiring blobs found. No alerts sent.")
            return

        print(f"\n📢 EXPIRE WARNING: {len(expiring_blobs)} blobs are expiring soon!")
        print("=" * 50)

        for blob in expiring_blobs:
            print(f"ID: {blob['id']}")
            print(f"File: {blob['fileName']}")
            print(f"Expires: {blob['expiresAt']} ({blob['daysLeft']} days left)")
            print("-" * 20)

        # Send alerts to all configured channels
        await self._send_dashboard_alert(expiring_blobs)

        if config.SLACK_WEBHOOK_URL:
            await self._send_slack_webhook(expiring_blobs)

        if config.DISCORD_WEBHOOK_URL:
            await self._send_discord_webhook(expiring_blobs)

        self.logger.info(f"Sent {len(expiring_blobs)} alerts.")

    async def _send_dashboard_alert(self, blobs: List[Dict[str, Any]]):
        url = f"{config.DASHBOARD_URL}/api/activity"

        message = f"⚠️ Expiry Warning: {len(blobs)} blobs are expiring soon. Check reports for details."

        payload = {
            "type": "system",
            "message": message,
            "status": "error"
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, timeout=5.0)
                if response.status_code == 200:
                    self.logger.info("Dashboard alert sent successfully.")
                else:
                    self.logger.warning(f"Dashboard alert failed with status {response.status_code}")
        except Exception as e:
            self.logger.error(f"Failed to send dashboard alert: {str(e)}")

    async def _send_slack_webhook(self, blobs: List[Dict[str, Any]]):
        """Send alert to Slack via Incoming Webhook"""
        url = config.SLACK_WEBHOOK_URL
        if not url:
            return

        # Build Slack Block Kit message
        blob_lines = []
        for blob in blobs[:10]:  # Limit to 10 to avoid Slack payload limits
            days = blob.get("daysLeft", "?")
            emoji = "🔴" if isinstance(days, int) and days <= 2 else "🟡"
            blob_lines.append(f"{emoji} *{blob['fileName']}* — {days} days left (`{blob['id'][:12]}...`)")

        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"⚠️ Shelby Expiry Alert — {len(blobs)} Blob(s)",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "\n".join(blob_lines)
                }
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": "🤖 Sent by *Shelby Expiry Guard* | <https://shelby.io|Dashboard>"
                    }
                ]
            }
        ]

        if len(blobs) > 10:
            blocks.insert(2, {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"_...and {len(blobs) - 10} more blobs_"
                }
            })

        payload = {"blocks": blocks}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, timeout=10.0)
                if response.status_code == 200:
                    self.logger.info("Slack webhook sent successfully.")
                else:
                    self.logger.warning(f"Slack webhook failed: {response.status_code} — {response.text}")
        except Exception as e:
            self.logger.error(f"Failed to send Slack webhook: {str(e)}")

    async def _send_discord_webhook(self, blobs: List[Dict[str, Any]]):
        """Send alert to Discord via Webhook with rich embed"""
        url = config.DISCORD_WEBHOOK_URL
        if not url:
            return

        # Build Discord embed fields
        fields = []
        for blob in blobs[:25]:  # Discord limit: 25 fields per embed
            days = blob.get("daysLeft", "?")
            emoji = "🔴" if isinstance(days, int) and days <= 2 else "🟡"
            fields.append({
                "name": f"{emoji} {blob['fileName']}",
                "value": f"ID: `{blob['id'][:16]}...`\nExpires in **{days} days**",
                "inline": True
            })

        embed = {
            "title": f"⚠️ Shelby Expiry Alert — {len(blobs)} Blob(s)",
            "description": "The following blobs are expiring soon and may need renewal.",
            "color": 16734006,  # Power Pink (#FF57B6) in decimal
            "fields": fields,
            "footer": {
                "text": "Shelby Expiry Guard • Automated Alert"
            },
            "timestamp": __import__("datetime").datetime.now().isoformat()
        }

        payload = {
            "username": "Shelby Expiry Guard",
            "avatar_url": "https://shelby.io/logo.png",
            "embeds": [embed]
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, timeout=10.0)
                if response.status_code in (200, 204):
                    self.logger.info("Discord webhook sent successfully.")
                else:
                    self.logger.warning(f"Discord webhook failed: {response.status_code} — {response.text}")
        except Exception as e:
            self.logger.error(f"Failed to send Discord webhook: {str(e)}")
