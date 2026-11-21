"""App-wide settings, read from environment variables (or a .env file in dev).

pydantic-settings' BaseSettings is just a pydantic model that auto-populates each field
from an environment variable of the same name (case-insensitive) if one is set, otherwise
falls back to the default given here. This is how the same code runs against a local
Postgres (docker-compose's defaults below) and, later, a different DB in production,
without editing code.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://laruso:laruso@localhost:5432/laruso"
    # 32+ bytes so HS256 doesn't warn about a weak key; still just a dev default — override
    # via the SECRET_KEY env var (or .env) for anything beyond your own machine.
    secret_key: str = "dev-secret-change-me-this-is-not-secure"
    access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
