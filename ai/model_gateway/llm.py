"""Model interface. The rest of Laruso only talks to `LLM`, so the provider can be swapped."""
import json
import urllib.request
from typing import Protocol


class LLM(Protocol):
    def generate(self, system: str, prompt: str) -> str: ...


class OllamaLLM:
    """Local model via Ollama's HTTP API (http://localhost:11434). No extra dependency."""

    def __init__(self, model: str = "gemma3:4b", host: str = "http://localhost:11434", timeout: float = 120):
        self.model, self.host, self.timeout = model, host, timeout

    def generate(self, system: str, prompt: str) -> str:
        body = json.dumps({
            "model": self.model,
            "system": system,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.4},
        }).encode()
        req = urllib.request.Request(f"{self.host}/api/generate", body, {"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            return json.load(resp)["response"].strip()


class FakeLLM:
    """Returns a fixed reply. For tests and for running without Ollama."""

    def __init__(self, reply: str = "Hi, we'd love to welcome you back."):
        self.reply = reply

    def generate(self, system: str, prompt: str) -> str:
        return self.reply
