from datetime import date

from agent_system.shared.contracts import GuestRecord

from .rules import score_guest

# Matches the three groups on the Laruso site. Lower number = more urgent.
CONTACT_TODAY = "Contact today"
THIS_WEEK = "This week"
LATER = "Later"
_ORDER = {CONTACT_TODAY: 0, THIS_WEEK: 1, LATER: 2}


def _priority(guest: GuestRecord) -> str:
    if guest["open_complaint"]:
        return CONTACT_TODAY      # an unhappy guest is the most urgent
    if guest["unfinished_search"]:
        return THIS_WEEK          # a sale that can still be won
    return LATER                  # return visit: no rush


def prioritize(guests: list[GuestRecord], today: date) -> list[dict]:
    """Guests worth contacting, most urgent first. Each item: guest, reasons, priority."""
    queue = []
    for guest in guests:
        reasons = score_guest(guest, today)
        if reasons:               # no reasons means nothing to do (includes opted-out guests)
            queue.append({"guest": guest, "reasons": reasons, "priority": _priority(guest)})
    # sorted() is stable, so guests with the same priority keep their order
    return sorted(queue, key=lambda item: _ORDER[item["priority"]])
