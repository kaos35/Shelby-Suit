#!/bin/bash

# Send Alerts immediately
# This script forces the alert system to run

# Source environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

echo "Triggering alerts..."
# Assuming run_guard handles alerts by default
python scripts/run_guard.py

echo "Use --dry-run to simulate without sending if supported."
