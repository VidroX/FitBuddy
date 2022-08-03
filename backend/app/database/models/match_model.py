from pymongo import IndexModel, ASCENDING
from beanie import Document, PydanticObjectId


class MatchModel(Document):
    user1: PydanticObjectId
    user2: PydanticObjectId
    user1_accepted: bool | None = None
    user2_accepted: bool | None = None
    
    class Settings:
        name = "matches"
        use_state_management = True
        indexes = [
            IndexModel(
                [
                    ("user1", ASCENDING),
                    ("user2", ASCENDING),
                ],
                name="user_match_index",
                unique=True
            )
        ]