FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY expiry_monitor/ ./expiry_monitor/
COPY scripts/ ./scripts/
COPY setup.py ./

# Make scripts executable
RUN chmod +x scripts/*.sh 2>/dev/null || true

ENV PYTHONUNBUFFERED=1
ENV LOG_LEVEL=INFO
ENV DASHBOARD_URL=http://dashboard:3000
ENV SHELBY_API_URL=https://api.shelby.io

CMD ["python", "scripts/run_guard.py"]
