#!/bin/bash

# Check expiry dates
# This script is intended to be run daily via cron

# Source environment variables if needed
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Run the guard
python scripts/run_guard.py

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo "$(date): Expiry check completed successfully."
else
    echo "$(date): Expiry check failed with code $EXIT_CODE."
    exit $EXIT_CODE
fi
