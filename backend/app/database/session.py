"""SQLAlchemy plumbing: one Engine (the DB connection pool) for the whole app, a session
factory, and `Base` — the class every ORM model inherits from so SQLAlchemy knows about it.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from backend.app.core.config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency: opens one DB session per request, always closes it afterward."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
