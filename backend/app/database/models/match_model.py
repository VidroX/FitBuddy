from pymongo import IndexModel, ASCENDING
from typing import List
from beanie import Document, Link
from app.database.models.activity_model import ActivityModel
from app.database.models.user_model import UserModel


class MatchModel(Document):
    user: Link[UserModel]
    match: Link[UserModel]
    common_activities: List[Link[ActivityModel]]
    
    class Settings:
        name = "matches"
        use_state_management = True
        indexes = [
            IndexModel(
                [
                    ("user", ASCENDING),
                    ("match", ASCENDING),
                ],
                name="user_match_index",
                unique=True
            )
        ]