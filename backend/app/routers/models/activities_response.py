from typing import List
from pydantic import BaseModel
from app.database.models.activity_model import ActivityModel


class ActivitiesResponse(BaseModel):
    activities: List[ActivityModel]