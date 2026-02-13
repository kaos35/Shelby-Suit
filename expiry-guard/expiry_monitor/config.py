"""
Configuration settings for Expiry Guard
"""
import os
from dataclasses import dataclass, field
from typing import Optional, List

@dataclass
class Config:
    """Application configuration"""
    
    # Alert thresholds
    ALERT_DAYS_BEFORE: int = int(os.getenv("ALERT_DAYS_BEFORE", "7"))
    CRITICAL_DAYS_BEFORE: int = int(os.getenv("CRITICAL_DAYS_BEFORE", "2"))
    
    # Notification settings
    WEBHOOK_URL: Optional[str] = os.getenv("WEBHOOK_URL")
    SLACK_WEBHOOK_URL: Optional[str] = os.getenv("SLACK_WEBHOOK_URL")
    DISCORD_WEBHOOK_URL: Optional[str] = os.getenv("DISCORD_WEBHOOK_URL")
    DASHBOARD_URL: str = os.getenv("DASHBOARD_URL", "http://localhost:3000")
    
    # Email settings (Brevo/SendGrid/SMTP)
    EMAIL_ENABLED: bool = os.getenv("EMAIL_ENABLED", "false").lower() == "true"
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_PASS: Optional[str] = os.getenv("SMTP_PASS")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "alerts@shelby.io")
    EMAIL_TO: List[str] = field(default_factory=lambda: os.getenv("EMAIL_TO", "").split(","))
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # API Settings for renewal
    SHELBY_API_URL: str = os.getenv("SHELBY_API_URL", "https://api.shelby.io")
    SHELBY_API_KEY: Optional[str] = os.getenv("SHELBY_API_KEY")

config = Config()
