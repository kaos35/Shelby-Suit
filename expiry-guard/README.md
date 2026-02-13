# ⏰ Shelby Expiry Guard

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org/)
[![pytest](https://img.shields.io/badge/Tests-pytest-green.svg)](https://pytest.org/)
[![httpx](https://img.shields.io/badge/HTTP-httpx-orange.svg)](https://www.python-httpx.org/)

Automated blob expiry monitoring and renewal service for the Shelby Protocol. Tracks blob lifetimes, sends alerts, and can auto-renew expiring blobs.

## ✨ Features

- 🔍 **Expiry Tracking** - Monitor blob expiry dates across accounts
- 🚨 **Alert System** - Console + Dashboard HTTP notifications
- 🔄 **Auto-Renewal** - Automatically renew expiring blobs
- 📊 **Dashboard Integration** - Push alerts to Shelby Dashboard via API
- ⚙️ **Configurable** - Thresholds, webhooks, email via environment variables
- 📧 **Email Support** - SMTP email notifications (configurable)
- 🕐 **Cron Scripts** - Ready-to-use shell scripts for scheduled monitoring

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- pip

### Installation

```bash
cd expiry-guard
pip install -r requirements.txt
```

### Usage

```bash
# Run the expiry guard
python scripts/run_guard.py

# Or use the shell scripts
bash scripts/check-expiry.sh
bash scripts/send-alerts.sh
bash scripts/generate-report.sh
```

## 📁 Project Structure

```
expiry-guard/
├── expiry_monitor/
│   ├── __init__.py
│   ├── config.py           # Configuration (env vars, thresholds)
│   ├── tracker.py          # ExpiryTracker - monitors blob expiry dates
│   ├── alerter.py          # ExpiryAlerter - sends alerts (console + dashboard)
│   └── renewal.py          # RenewalService - auto-renews expiring blobs
├── scripts/
│   ├── run_guard.py        # Main entry point
│   ├── check-expiry.sh     # Cron job for expiry checks
│   ├── send-alerts.sh      # Cron job for alert sending
│   └── generate-report.sh  # Report generation script
├── tests/
│   └── test_expiry_guard.py  # 9 tests (tracker, alerter, renewal, config)
├── requirements.txt
└── setup.py
```

## 🔧 Configuration

All configuration is done via environment variables:

### Alert Thresholds

```env
ALERT_DAYS_BEFORE=7        # Days before expiry to send warning
CRITICAL_DAYS_BEFORE=2     # Days before expiry for critical alert
```

### Dashboard Integration

```env
DASHBOARD_URL=http://localhost:3000   # Shelby Dashboard URL
```

The alerter sends HTTP POST requests to `{DASHBOARD_URL}/api/activity` when blobs are expiring:

```json
{
  "type": "system",
  "message": "⚠️ Expiry Warning: 3 blobs are expiring soon.",
  "status": "error"
}
```

### Webhook & Email

```env
WEBHOOK_URL=https://your-webhook.com/hook
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=alerts@shelby.io
EMAIL_TO=admin@example.com,ops@example.com
```

### API & Logging

```env
SHELBY_API_URL=https://api.shelby.io
SHELBY_API_KEY=your-api-key
LOG_LEVEL=INFO
```

## 🏗️ Architecture

```
┌─────────────────────┐
│   ExpiryTracker     │  → Fetches blobs from Shelby API
│   (tracker.py)      │  → Filters by expiry threshold
└────────┬────────────┘
         │ expiring blobs
         ▼
┌─────────────────────┐
│   ExpiryAlerter     │  → Console output
│   (alerter.py)      │  → Dashboard HTTP POST
└────────┬────────────┘  → Webhook/Email (planned)
         │ blob IDs
         ▼
┌─────────────────────┐
│   RenewalService    │  → POST /api/blob/{id}/renew
│   (renewal.py)      │  → Returns success/failure per blob
└─────────────────────┘
```

## 🧪 Testing

```bash
# Run all tests
python -m pytest tests/ -v

# With coverage
python -m pytest tests/ --cov=expiry_monitor --cov-report=html
```

**Test Coverage:** 9 tests across 4 classes:
- `TestExpiryTracker` (3 tests) - API fetching, error handling, date parsing
- `TestExpiryAlerter` (2 tests) - Empty alerts, dashboard POST
- `TestRenewalService` (3 tests) - Success, failure, network error
- `TestConfig` (1 test) - Default values validation

## 🕐 Cron Setup

For automated monitoring, add to your crontab:

```cron
# Check for expiring blobs every 6 hours
0 */6 * * * cd /path/to/expiry-guard && bash scripts/check-expiry.sh

# Send alert digest daily at 9am
0 9 * * * cd /path/to/expiry-guard && bash scripts/send-alerts.sh

# Generate weekly report on Mondays
0 10 * * 1 cd /path/to/expiry-guard && bash scripts/generate-report.sh
```

## 📄 License

MIT License - see [LICENSE](../LICENSE)
