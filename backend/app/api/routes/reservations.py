from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_current_user
from backend.app.database.session import get_db
from backend.app.modules.guests.models import Guest
from backend.app.modules.reservations.models import Reservation
from backend.app.modules.reservations.schemas import ReservationCreate, ReservationOut
from backend.app.modules.reservations.service import has_overlap
from backend.app.modules.rooms.models import Room
from backend.app.modules.users.models import User

router = APIRouter(prefix="/reservations", tags=["reservations"])


@router.post("", response_model=ReservationOut, status_code=status.HTTP_201_CREATED)
def create_reservation(
    payload: ReservationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if payload.check_out <= payload.check_in:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "check_out must be after check_in")

    # Every lookup is scoped to the caller's hotel_id — a guest_id/room_id belonging to
    # another hotel simply doesn't match, and comes back as 404, not someone else's data.
    guest = db.query(Guest).filter(Guest.id == payload.guest_id, Guest.hotel_id == current_user.hotel_id).first()
    if guest is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Guest not found")

    room = db.query(Room).filter(Room.id == payload.room_id, Room.hotel_id == current_user.hotel_id).first()
    if room is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Room not found")

    if has_overlap(db, current_user.hotel_id, payload.room_id, payload.check_in, payload.check_out):
        raise HTTPException(status.HTTP_409_CONFLICT, "Room is already booked for part of that date range")

    reservation = Reservation(
        hotel_id=current_user.hotel_id,
        guest_id=payload.guest_id,
        room_id=payload.room_id,
        check_in=payload.check_in,
        check_out=payload.check_out,
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


@router.get("", response_model=list[ReservationOut])
def list_reservations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Reservation).filter(Reservation.hotel_id == current_user.hotel_id).all()


@router.post("/{reservation_id}/cancel", response_model=ReservationOut)
def cancel_reservation(
    reservation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    reservation = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id, Reservation.hotel_id == current_user.hotel_id)
        .first()
    )
    if reservation is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Reservation not found")

    reservation.status = "cancelled"
    db.commit()
    db.refresh(reservation)
    return reservation
