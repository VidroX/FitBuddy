from pydantic import BaseModel
from app.services.types.coordinates import Coordinates


class Address(BaseModel):
    name: str
    coordinates: Coordinates | None