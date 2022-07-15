from typing import List
from pydantic import BaseModel, Field
from app.database.models.activity_model import ActivityModel
from app.models.user import User


class Match(BaseModel):
    match: User | None = Field(alias="user")
    shared_activities: List[ActivityModel] = Field(default=[])
    
    class Config:
        allow_population_by_field_name = True

class MatchesResponse(BaseModel):
    matches: List[Match]