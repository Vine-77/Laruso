"""Password hashing and JWT (JSON Web Token) helpers.

A JWT is just a signed, base64-encoded blob of claims (here: which user, which hotel,
when it expires) — the server can verify it wasn't tampered with (via the signature)
without needing to look anything up, which is why it works well as a stateless "login
token" the frontend sends back on every request.
"""
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from backend.app.core.config import settings

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_access_token(data: dict, expires_minutes: int | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes or settings.access_token_expire_minutes
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Raises jwt.PyJWTError (expired, bad signature, malformed...) if the token is invalid."""
    return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
