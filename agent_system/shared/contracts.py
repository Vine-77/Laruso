"""Data contracts the agent system depends on, owned by the agent system — not by backend.

This is the decoupling boundary described in PROJECT_OVERVIEW.md: agent packages must not
import backend modules or reach into its data/database layer directly. Instead, an agent
package declares the shape of data it needs (as plain, backend-agnostic types below), and
whatever wires an agent to a real data source (today: a thin script in `scripts/`; later:
a FastAPI route or a task queue) is responsible for handing it data in this shape.

Backend is free to change how it produces a GuestRecord (CSV today, PostgreSQL later)
without the agent system ever needing to change, as long as the shape stays the same.
"""
from datetime import date
from typing import TypedDict


class GuestRecord(TypedDict):
    """One guest, as the guest_retention agent (and any future guest-facing agent) needs it."""
    email: str
    name: str
    last_stay: date | None
    opted_out: bool
    open_complaint: bool
    unfinished_search: bool
