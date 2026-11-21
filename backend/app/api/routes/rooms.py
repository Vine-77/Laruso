from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_current_user
from backend.app.database.session import get_db
from backend.app.modules.rooms.models import Room
from backend.app.modules.rooms.schemas import RoomCreate, RoomOut
from backend.app.modules.users.models import User

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("", response_model=RoomOut, status_code=status.HTTP_201_CREATED)
def create_room(
    payload: RoomCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    exists = (
        db.query(Room)
        .filter(Room.hotel_id == current_user.hotel_id, Room.number == payload.number)
        .first()
    )
    if exists:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "A room with that number already exists")

    room = Room(hotel_id=current_user.hotel_id, number=payload.number, room_type=payload.room_type)
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


@router.get("", response_model=list[RoomOut])
def list_rooms(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # The tenant boundary, enforced on every read: always filter by the caller's own hotel_id.
    return db.query(Room).filter(Room.hotel_id == current_user.hotel_id).all()
