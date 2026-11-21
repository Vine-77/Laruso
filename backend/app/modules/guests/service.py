"""Public interface of the guests module.

Other code (scripts, a future FastAPI route, other backend modules, or whatever wires an
agent to real data — see scripts/run_pipeline.py) should import from here, not from
`merge` directly. That keeps `merge`'s implementation (CSV files today, a database later)
free to change without breaking callers, and it's the seam the agent_system package is
deliberately kept on the other side of (see agent_system/shared/contracts.py).
"""
from .merge import build_guests


def list_guests() -> list[dict]:
    """Every known guest as a plain dict matching agent_system.shared.contracts.GuestRecord."""
    return build_guests()
