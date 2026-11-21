"""Runs once, before any test module in this directory is collected — which is earlier
than any of those modules' own top-level code. That matters because `backend.app.main`
(and the DB engine it builds from DATABASE_URL at import time) gets cached in sys.modules
on first import: setting DATABASE_URL separately in each test file does nothing for the
second file onward. Setting it exactly once, here, avoids that trap.
"""
import os
import tempfile
from pathlib import Path

import pytest

_db_file = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
_db_file.close()
os.environ["DATABASE_URL"] = f"sqlite:///{_db_file.name}"


@pytest.fixture(scope="session", autouse=True)
def _cleanup_test_db():
    yield
    Path(_db_file.name).unlink(missing_ok=True)
