from typing import List
from pydantic import BaseModel
from app.database.models.activity_model import ActivityModel
from app.models.user import User


class Match(BaseModel):
    user: User
    common_activities: List[ActivityModel]

class MatchesResponse(BaseModel):
    matches: List[Match]