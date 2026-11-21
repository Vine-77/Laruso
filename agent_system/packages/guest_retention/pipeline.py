"""The guest_retention agent's flow: score -> draft -> guardrails -> queue. Nothing is sent.

This module intentionally does not import anything from `backend`. It depends only on
`agent_system.shared.contracts.GuestRecord` and `ai.model_gateway.llm.LLM` — both are
agent-system-owned contracts. Whoever assembles a real run (see `scripts/run_pipeline.py`)
is responsible for fetching guests from wherever they actually live (backend's guests
module today, a database later) and handing them to `run_pipeline` as plain data.
"""
from dataclasses import dataclass, field
from datetime import date

from agent_system.shared.contracts import GuestRecord
from agent_system.shared.guardrails import check_draft
from ai.model_gateway.llm import LLM

from .draft import draft_message
from .priority import prioritize


@dataclass
class QueueItem:
    guest: GuestRecord
    reasons: list[str]
    priority: str
    draft: str
    issues: list[str] = field(default_factory=list)
    status: str = "pending"          # a person changes this: approved / edited / rejected

    @property
    def needs_attention(self) -> bool:
        return bool(self.issues)


def run_pipeline(today: date, llm: LLM, guests: list[GuestRecord]) -> list[QueueItem]:
    """Draft a message for every guest worth contacting, most urgent first.

    `guests` is supplied by the caller (see module docstring) — this function never
    fetches guest data itself.
    """
    queue = []
    for item in prioritize(guests, today):
        guest = item["guest"]
        reason = "; ".join(item["reasons"])
        text = draft_message(llm, guest["name"], reason)
        issues = check_draft(text, guest["opted_out"])
        queue.append(QueueItem(guest, item["reasons"], item["priority"], text, issues))
    return queue


def show(queue: list[QueueItem]) -> None:
    if not queue:
        print("Nobody to contact today.")
    for n, q in enumerate(queue, 1):
        print(f"\n{n}. [{q.priority}] {q.guest['name']}  ({q.status})")
        print("   Why:  " + "; ".join(q.reasons))
        print("   Draft: " + q.draft.replace("\n", "\n          "))
        for issue in q.issues:
            print(f"   !! {issue}")
