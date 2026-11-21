from pydantic import BaseModel


class RoomCreate(BaseModel):
    number: str
    room_type: str


class RoomOut(BaseModel):
    id: int
    hotel_id: int
    number: str
    room_type: str
    is_clean: bool

    model_config = {"from_attributes": True}
