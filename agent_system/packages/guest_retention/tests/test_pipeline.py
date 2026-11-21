from datetime import date

from ai.model_gateway.llm import FakeLLM
from agent_system.packages.guest_retention.pipeline import run_pipeline

TODAY = date(2026, 11, 19)
CLEAN = "Hi there, we are sorry we did not reply sooner and would love to welcome you back soon."


def make_guest(name, **changes):
    guest = {
        "email": f"{name.lower().replace(' ', '.')}@example.com",
        "name": name,
        "last_stay": date(2026, 11, 10),
        "opted_out": False,
        "open_complaint": False,
        "unfinished_search": False,
    }
    guest.update(changes)
    return guest


GUESTS = [
    make_guest("Jane Miller", open_complaint=True),
    make_guest("Lena Fischer", opted_out=True, open_complaint=True),  # opted out: never queued
]


def test_queue_contains_guests_worth_contacting():
    names = [q.guest["name"] for q in run_pipeline(TODAY, FakeLLM(CLEAN), GUESTS)]
    assert "Jane Miller" in names
    assert "Lena Fischer" not in names          # opted out


def test_clean_drafts_have_no_issues_and_are_pending():
    queue = run_pipeline(TODAY, FakeLLM(CLEAN), GUESTS)
    assert queue and all(q.status == "pending" for q in queue)
    assert not any(q.needs_attention for q in queue)


def test_bad_draft_is_flagged_not_dropped():
    bad_llm = FakeLLM("Warmly, The [Hotel Name] team, enjoy 20% off your stay!")
    queue = run_pipeline(TODAY, bad_llm, GUESTS)
    assert queue                                  # still shown to a person
    assert all(q.needs_attention for q in queue)
    assert any("placeholder" in i for i in queue[0].issues)


def test_most_urgent_first():
    queue = run_pipeline(TODAY, FakeLLM(CLEAN), GUESTS)
    assert queue[0].priority == "Contact today"
