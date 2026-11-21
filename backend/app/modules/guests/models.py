"""The real, persisted Guest CRM record (Phase 2: Core Hotel Operations).

Not to be confused with `merge.py`/`service.py` in this same folder — those build plain
dicts from sandbox CSV fixtures, purely to feed the `guest_retention` agent prototype
(Phase 5). This `Guest` ORM model is the actual database-backed guest record that the
rest of the platform (reservations, future CRM features) will build on. The two will
eventually need reconciling — tracked as a known gap, not solved here.
"""
from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.database.session import Base


class Guest(Base):
    __tablename__ = "guests"
    __table_args__ = (UniqueConstraint("hotel_id", "email", name="uq_guest_email_per_hotel"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    hotel_id: Mapped[int] = mapped_column(ForeignKey("hotels.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False, index=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
