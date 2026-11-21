from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.database.session import Base


class Hotel(Base):
    """A tenant. Every other hotel-owned record will eventually carry a hotel_id FK to this."""

    __tablename__ = "hotels"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
