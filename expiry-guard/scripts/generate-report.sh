#!/bin/bash

# Generate Monthly Report
# This script aggregates the logs or calls a reporting function

DATE=$(date +%Y-%m-%d)
REPORT_FILE="reports/expiry-report-$DATE.log"

mkdir -p reports

echo "Generating Expiry Report for $DATE" > $REPORT_FILE
echo "=====================================" >> $REPORT_FILE
echo "Checking logs from Expiry Guard..." >> $REPORT_FILE
# Assuming logs are written to stdout or a file.
# For now, append output of run_guard.py
python scripts/run_guard.py --report >> $REPORT_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "Report generated at $REPORT_FILE"
else
    echo "Failed to generate full report."
fi
