"""Composition root: the one place that wires backend data, the model gateway, and the
guest_retention agent together and actually runs something. Nothing here is imported by
backend/ or agent_system/ — it only imports *them*, which is what keeps those two decoupled
(see PROJECT_OVERVIEW.md and agent_system/shared/contracts.py).

Run from the repo root after `pip install -e .`:

    python scripts/run_pipeline.py
"""
from datetime import date

from ai.model_gateway.llm import OllamaLLM
from backend.app.modules.guests.service import list_guests
from agent_system.packages.guest_retention.pipeline import run_pipeline, show

if __name__ == "__main__":
    show(run_pipeline(date.today(), OllamaLLM(), list_guests("H001")))
