from datetime import date

from pydantic import BaseModel


class ReservationCreate(BaseModel):
    guest_id: int
    room_id: int
    check_in: date
    check_out: date


class ReservationOut(BaseModel):
    id: int
    hotel_id: int
    guest_id: int
    room_id: int
    check_in: date
    check_out: date
    status: str

    model_config = {"from_attributes": True}
