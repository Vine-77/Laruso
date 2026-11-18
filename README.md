# Laruso

An AI follow-up assistant for hotels. It finds guests worth contacting, drafts a personal message, and waits for a person to approve it.

- `website/` — landing page (Next.js)
- `backend/` — guest data, scoring, guardrails and the agent (Python)

## Run the website

    npm run install:all
    npm run dev

## Backend

    cd backend
    python -m venv .venv && source .venv/bin/activate
    pip install -e ".[dev]"
    python scripts/sample_data.py      # write sample CSVs to backend/data
    python -m laruso.data.merge        # build guest profiles

Layout: `laruso/data` (load + merge), `laruso/scoring` (who to contact, with reasons), `laruso/guardrails` (opt-outs, no price/room promises), `laruso/agent` (draft flow), `laruso/api` (endpoints for the approval queue), `tests/`.

Example data only. Not a commercial product.
