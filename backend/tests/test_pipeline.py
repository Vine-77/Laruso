from datetime import date

from laruso.agent.llm import FakeLLM
from laruso.pipeline import run_pipeline

TODAY = date(2026, 11, 19)
CLEAN = "Hi there, we are sorry we did not reply sooner and would love to welcome you back soon."


def test_queue_contains_guests_worth_contacting():
    names = [q.guest["name"] for q in run_pipeline(TODAY, FakeLLM(CLEAN))]
    assert "Jane Miller" in names
    assert "Lena Fischer" not in names          # opted out


def test_clean_drafts_have_no_issues_and_are_pending():
    queue = run_pipeline(TODAY, FakeLLM(CLEAN))
    assert queue and all(q.status == "pending" for q in queue)
    assert not any(q.needs_attention for q in queue)


def test_bad_draft_is_flagged_not_dropped():
    queue = run_pipeline(TODAY, FakeLLM("Warmly, The [Hotel Name] team, enjoy 20% off your stay!"))
    assert queue                                  # still shown to a person
    assert all(q.needs_attention for q in queue)
    assert any("placeholder" in i for i in queue[0].issues)


def test_most_urgent_first():
    queue = run_pipeline(TODAY, FakeLLM(CLEAN))
    assert queue[0].priority == "Contact today"
