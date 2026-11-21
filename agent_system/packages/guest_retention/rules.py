from datetime import date

from agent_system.shared.contracts import GuestRecord


def score_guest(guest: GuestRecord, today: date) -> list[str]:
    """Return the reasons to contact this guest. Empty list means no reason. """
    reasons = []
    if guest["opted_out"]:
        return reasons
    if guest["open_complaint"]:
        reasons.append("Guest has an open complaint")
    if guest["unfinished_search"]:
        reasons.append("Guest has an unfinished search")
    if guest["last_stay"] is not None and 400 > (today - guest["last_stay"]).days > 300:
        reasons.append("Guest has not stayed in over a year, consider to invite them back")
    return reasons
