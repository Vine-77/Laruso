from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.app.api.routes import auth, guests, health, reservations, rooms
from backend.app.database.session import Base, engine
from backend.app.modules.guests import models as guest_models  # noqa: F401  (registers the table)
from backend.app.modules.hotels import models as hotel_models  # noqa: F401  (registers the table)
from backend.app.modules.reservations import models as reservation_models  # noqa: F401
from backend.app.modules.rooms import models as room_models  # noqa: F401  (registers the table)
from backend.app.modules.users import models as user_models  # noqa: F401  (registers the table)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once on startup, before the app accepts requests (the `yield` is where the app
    # actually runs; anything after it would run on shutdown — nothing needed there yet).
    # create_all is fine for this prototype (it creates tables that don't exist yet and
    # leaves existing ones alone). A real migration tool (Alembic) replaces this once the
    # schema needs to change without wiping or guessing at existing data — not needed yet.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Laruso API", lifespan=lifespan)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(rooms.router)
app.include_router(guests.router)
app.include_router(reservations.router)
