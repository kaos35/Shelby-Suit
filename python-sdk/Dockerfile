FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY shelby_sdk/ ./shelby_sdk/
COPY setup.py pyproject.toml ./

# Install the SDK itself
RUN pip install --no-cache-dir -e .

ENV PYTHONUNBUFFERED=1

CMD ["python", "-c", "from shelby_sdk import ShelbyClient; print('Shelby SDK ready')"]
