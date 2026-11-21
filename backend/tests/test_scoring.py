from datetime import date

from laruso.scoring.rules import score_guest

TODAY = date(2026, 11, 18)


def make_guest(**changes):
    """A normal guest with no reason to be contacted. Tests change only what they care about."""
    guest = {
        "name": "Jane Miller",
        "last_stay": date(2026, 11, 10),  # last week
        "opted_out": False,
        "open_complaint": False,
        "unfinished_search": False,
    }
    guest.update(changes)
    return guest


def test_normal_guest_has_no_reasons():
    assert score_guest(make_guest(), TODAY) == []


def test_opted_out_guest_returns_nothing():
    guest = make_guest(opted_out=True, open_complaint=True, unfinished_search=True)
    assert score_guest(guest, TODAY) == []


def test_open_complaint_is_a_reason():
    reasons = score_guest(make_guest(open_complaint=True), TODAY)
    assert len(reasons) == 1
    assert "complaint" in reasons[0].lower()


def test_unfinished_search_is_a_reason():
    reasons = score_guest(make_guest(unfinished_search=True), TODAY)
    assert len(reasons) == 1
    assert "book" in reasons[0].lower() or "search" in reasons[0].lower()


def test_stay_about_a_year_ago_is_a_reason():
    # 11 months ago: the anniversary is coming up
    reasons = score_guest(make_guest(last_stay=date(2025, 12, 14)), TODAY)
    assert len(reasons) == 1
    assert "stay" in reasons[0].lower()


def test_recent_stay_is_not_a_reason():
    assert score_guest(make_guest(last_stay=date(2026, 11, 10)), TODAY) == []


def test_very_old_stay_is_not_an_anniversary():
    assert score_guest(make_guest(last_stay=date(2022, 1, 1)), TODAY) == []


def test_several_reasons_are_all_reported():
    guest = make_guest(open_complaint=True, unfinished_search=True, last_stay=date(2025, 12, 14))
    assert len(score_guest(guest, TODAY)) == 3


def test_guest_who_never_stayed_does_not_crash():
    guest = make_guest(last_stay=None, unfinished_search=True)
    assert len(score_guest(guest, TODAY)) == 1
