from pydantic import BaseModel
from app.routers.models.matches_response import Match


class MatchMessage(BaseModel):
    message: str
    match: Match