from typing import List
from pydantic import BaseModel, Field
from app.database.models.activity_model import ActivityModel
from app.models.user import User


class CoupledUserMatch(BaseModel):
    user1: User
    user2: User
    user1_accepted: bool | None
    user2_accepted: bool | None

class MatchWithAcceptance(BaseModel):
    match: User
    user_accepted: bool | None
    match_accepted: bool | None

class Match(BaseModel):
    match: User | None = Field(alias="user")
    shared_activities: List[ActivityModel] = Field(default=[])
    
    class Config:
        allow_population_by_field_name = True

class MatchesResponse(BaseModel):
    matches: List[Match]

class AcceptedRejectedMatches(BaseModel):
    accepted: List[User]
    rejected: List[User]