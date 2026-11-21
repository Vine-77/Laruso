from pydantic import BaseModel, EmailStr


class HotelRegister(BaseModel):
    hotel_name: str
    hotel_slug: str
    owner_email: EmailStr
    owner_password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    hotel_id: int

    # Lets pydantic build this straight from a SQLAlchemy User object's attributes,
    # instead of requiring a dict.
    model_config = {"from_attributes": True}
