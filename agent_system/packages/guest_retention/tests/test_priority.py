from datetime import date

from agent_system.packages.guest_retention.priority import CONTACT_TODAY, LATER, THIS_WEEK, prioritize

TODAY = date(2026, 11, 19)


def make_guest(name, **changes):
    guest = {"name": name, "email": f"{name}@example.com", "last_stay": date(2026, 11, 10),
             "opted_out": False, "open_complaint": False, "unfinished_search": False}
    guest.update(changes)
    return guest


def test_complaint_comes_before_search_before_return():
    guests = [
        make_guest("sam", last_stay=date(2025, 12, 14)),
        make_guest("ali", unfinished_search=True),
        make_guest("jane", open_complaint=True),
    ]
    queue = prioritize(guests, TODAY)
    assert [q["guest"]["name"] for q in queue] == ["jane", "ali", "sam"]
    assert [q["priority"] for q in queue] == [CONTACT_TODAY, THIS_WEEK, LATER]


def test_guests_with_no_reason_are_left_out():
    assert prioritize([make_guest("nobody")], TODAY) == []


def test_opted_out_guest_is_never_queued():
    assert prioritize([make_guest("lena", opted_out=True, open_complaint=True)], TODAY) == []


def test_complaint_wins_when_guest_has_several_reasons():
    queue = prioritize([make_guest("jane", open_complaint=True, unfinished_search=True)], TODAY)
    assert queue[0]["priority"] == CONTACT_TODAY
    assert len(queue[0]["reasons"]) == 2
