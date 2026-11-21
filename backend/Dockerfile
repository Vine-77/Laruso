# Built from the repo root (see docker-compose.yml's `context: .`) because this image
# needs backend/, ai/ and agent_system/ together — that's what the root pyproject.toml
# installs as one editable package.
FROM python:3.12-slim

WORKDIR /app

# libpq-dev: the PostgreSQL client headers psycopg2 needs if it has to compile from
# source on this platform (psycopg2-binary usually avoids this, but it's a cheap safety net).
RUN apt-get update && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
COPY backend ./backend
COPY ai ./ai
COPY agent_system ./agent_system

RUN pip install --no-cache-dir -e ".[dev]"

EXPOSE 8000
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
