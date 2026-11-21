"""The one business rule this module enforces server-side, regardless of what a client
(or an AI agent calling the Booking Agent, later) claims: a room can't be double-booked.
"""
from datetime import date

from sqlalchemy.orm import Session

from backend.app.modules.reservations.models import Reservation


def has_overlap(
    db: Session,
    hotel_id: int,
    room_id: int,
    check_in: date,
    check_out: date,
    exclude_id: int | None = None,
) -> bool:
    """True if [check_in, check_out) overlaps an existing, non-cancelled reservation for
    this room. Two ranges overlap unless one ends before the other starts."""
    query = db.query(Reservation).filter(
        Reservation.hotel_id == hotel_id,
        Reservation.room_id == room_id,
        Reservation.status != "cancelled",
        Reservation.check_in < check_out,
        Reservation.check_out > check_in,
    )
    if exclude_id is not None:
        query = query.filter(Reservation.id != exclude_id)
    return db.query(query.exists()).scalar()
