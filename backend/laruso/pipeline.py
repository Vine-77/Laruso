"""The whole flow in one place: merge -> score -> draft -> guardrails -> queue. Nothing is sent."""
from dataclasses import dataclass, field
from datetime import date

from .agent.draft import draft_message
from .agent.llm import LLM, OllamaLLM
from .data.merge import build_guests
from .guardrails.checks import check_draft
from .scoring.priority import prioritize


@dataclass
class QueueItem:
    guest: dict
    reasons: list[str]
    priority: str
    draft: str
    issues: list[str] = field(default_factory=list)
    status: str = "pending"          # a person changes this: approved / edited / rejected

    @property
    def needs_attention(self) -> bool:
        return bool(self.issues)


def run_pipeline(today: date, llm: LLM) -> list[QueueItem]:
    """Draft a message for every guest worth contacting, most urgent first."""
    queue = []
    for item in prioritize(build_guests(), today):
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


if __name__ == "__main__":
    show(run_pipeline(date.today(), OllamaLLM()))
