from ai.model_gateway.llm import LLM

SYSTEM = (
    "You write short, warm, personal follow-up messages from a hotel to a past guest. "
    "Keep it under 60 words. Never mention prices, discounts, or specific rooms. "
    "Do not promise anything. Write only the message text."
)


def draft_message(llm: LLM, guest_name: str, reason: str) -> str:
    """Ask the model for a draft. Guardrails must check the result before it reaches a person."""
    first = guest_name.split()[0]
    prompt = f"Guest: {first}\nWhy we are writing: {reason}\nWrite the message."
    return llm.generate(SYSTEM, prompt)
