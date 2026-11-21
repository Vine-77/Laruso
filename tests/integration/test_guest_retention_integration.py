"""Integration tests: the one place allowed to depend on both `backend` and
`agent_system`, proving the seam between them (real sample data -> real pipeline)
actually works. Unit tests for each side stay decoupled — see their own packages.
"""
from datetime import date

from ai.model_gateway.llm import FakeLLM
from backend.app.modules.guests.service import list_guests
from agent_system.packages.guest_retention.pipeline import run_pipeline
from agent_system.packages.guest_retention.priority import prioritize
from agent_system.packages.guest_retention.rules import score_guest

TODAY = date(2026, 11, 19)
CLEAN = "Hi there, we are sorry we did not reply sooner and would love to welcome you back soon."


def by_email(guests):
    return {g["email"]: g for g in guests}


def test_merged_guests_work_with_scoring():
    guests = by_email(list_guests())
    assert score_guest(guests["jane.miller@example.com"], TODAY) == ["Guest has an open complaint"]
    assert score_guest(guests["lena.fischer@example.com"], TODAY) == []


def test_real_sample_data_is_prioritized():
    queue = prioritize(list_guests(), TODAY)
    names = [q["guest"]["name"] for q in queue]
    assert "Jane Miller" in names and "Lena Fischer" not in names


def test_pipeline_runs_end_to_end_on_real_sample_data():
    queue = run_pipeline(TODAY, FakeLLM(CLEAN), list_guests())
    names = [q.guest["name"] for q in queue]
    assert "Jane Miller" in names
    assert "Lena Fischer" not in names           # opted out
    assert queue[0].priority == "Contact today"  # most urgent first
    assert all(q.status == "pending" for q in queue)
