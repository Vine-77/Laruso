# Laruso

An AI-powered hotel management and guest-relationship platform, built incrementally. See **[docs/architecture/overview.md](docs/architecture/overview.md)** for the full picture: current state, the long-term architecture, and the roadmap. Read that before making changes.

```
frontend/      Next.js marketing site
backend/app/   Backend domain logic (FastAPI/PostgreSQL planned; CSV-backed prototype today)
ai/            Model-provider infrastructure (Ollama / gemma3:4b today)
agent_system/  Reusable AI agent packages (one exists so far: guest_retention)
sandbox/       Fictional/sample data, kept out of production modules
scripts/       Composition-root scripts that wire everything together
tests/         Integration tests crossing package boundaries
docs/          Architecture and planning docs
```

## Run it

```
npm run install:all
npm run dev                             # frontend
```

```
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
python backend/scripts/sample_data.py   # write sample data to sandbox/fixtures/
python scripts/run_pipeline.py          # run the guest_retention agent end to end
pytest                                   # run all tests
```

Example data only. Not a commercial product (yet).
