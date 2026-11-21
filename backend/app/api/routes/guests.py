from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_current_user
from backend.app.database.session import get_db
from backend.app.modules.guests.models import Guest
from backend.app.modules.guests.schemas import GuestCreate, GuestOut
from backend.app.modules.users.models import User

router = APIRouter(prefix="/guests", tags=["guests"])


@router.post("", response_model=GuestOut, status_code=status.HTTP_201_CREATED)
def create_guest(
    payload: GuestCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    exists = (
        db.query(Guest)
        .filter(Guest.hotel_id == current_user.hotel_id, Guest.email == payload.email)
        .first()
    )
    if exists:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "A guest with that email already exists")

    guest = Guest(hotel_id=current_user.hotel_id, name=payload.name, email=payload.email, phone=payload.phone)
    db.add(guest)
    db.commit()
    db.refresh(guest)
    return guest


@router.get("", response_model=list[GuestOut])
def list_guests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Guest).filter(Guest.hotel_id == current_user.hotel_id).all()
