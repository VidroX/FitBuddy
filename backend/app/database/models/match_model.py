from pymongo import IndexModel, ASCENDING
from beanie import Document, PydanticObjectId


class MatchModel(Document):
    user: PydanticObjectId
    match: PydanticObjectId
    
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