from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.app.api.deps import get_current_user
from backend.app.core.security import create_access_token, hash_password, verify_password
from backend.app.database.session import get_db
from backend.app.modules.hotels.models import Hotel
from backend.app.modules.users.models import User
from backend.app.modules.users.schemas import HotelRegister, Token, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register-hotel", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_hotel(payload: HotelRegister, db: Session = Depends(get_db)):
    """Create a new tenant (Hotel) plus its first user (the owner) in one call."""
    if db.query(Hotel).filter(Hotel.slug == payload.hotel_slug).first():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "That hotel slug is taken")
    if db.query(User).filter(User.email == payload.owner_email).first():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "That email is already registered")

    hotel = Hotel(name=payload.hotel_name, slug=payload.hotel_slug)
    db.add(hotel)
    db.flush()  # assigns hotel.id without committing the transaction yet

    owner = User(
        hotel_id=hotel.id,
        email=payload.owner_email,
        hashed_password=hash_password(payload.owner_password),
        role="owner",
    )
    db.add(owner)
    db.commit()
    db.refresh(owner)
    return owner


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm is FastAPI's standard "username + password" form body —
    # we're using the user's email as the username.
    user = db.query(User).filter(User.email == form.username).first()
    if user is None or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")

    token = create_access_token({"sub": str(user.id), "hotel_id": user.hotel_id})
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
