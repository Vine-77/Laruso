from laruso.agent.draft import draft_message
from laruso.agent.llm import FakeLLM


def test_draft_uses_llm_reply():
    assert draft_message(FakeLLM("Hi Jane"), "Jane Miller", "noise complaint, no reply") == "Hi Jane"


def test_prompt_has_first_name_and_reason():
    seen = {}

    class Spy:
        def generate(self, system, prompt):
            seen["prompt"] = prompt
            return "ok"

    draft_message(Spy(), "Jane Miller", "noise complaint")
    assert "Jane" in seen["prompt"] and "Miller" not in seen["prompt"]
    assert "noise complaint" in seen["prompt"]
