from pydantic import BaseModel, EmailStr


class GuestCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None


class GuestOut(BaseModel):
    id: int
    hotel_id: int
    name: str
    email: EmailStr
    phone: str | None

    model_config = {"from_attributes": True}
