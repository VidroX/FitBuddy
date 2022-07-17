from typing import Any
from beanie import PydanticObjectId
from bson import ObjectId
from app.database.models.user_model import UserModel
from app.helpers.jwt_helper import JWTHelper
from app.models.enums.token_type import TokenType
from app.models.user import AggregationUser, User


class UserHelper():
    @staticmethod
    async def get_user_from_token(token: str, allowed_token_type: TokenType = TokenType.Access) -> User | None:
        if not token:
            return None
        
        token_claims = JWTHelper.decode_token(token)
        
        if not token_claims:
            return None
        
        token_type = token_claims.get("type", None)
        
        if token_type is None or token_type != allowed_token_type:
            return None
        
        user_id = token_claims.get("sub", "")
        
        if len(user_id) != 24:
            return None
        
        users = await UserModel.find(UserModel.id == ObjectId(user_id)) \
            .aggregate(
            [
                {
                    "$lookup": {
                        "from": "activities",
                        "localField": "activities",
                        "foreignField": "_id",
                        "as": "activities"
                    }
                },
                {
                    "$limit": 1
                }
            ],
            projection_model=User   
        ).to_list()
        
        return None if users is None or len(users) < 1 else users[0]
    
    @staticmethod
    async def get_aggregated_user_from_db(field: Any, value: str) -> AggregationUser | None:
        if isinstance(value, str) and isinstance(field, PydanticObjectId):
            value = ObjectId(value)
        
        users = await UserModel.find(field == value) \
            .aggregate(
            [
                {
                    "$lookup": {
                        "from": "activities",
                        "localField": "activities",
                        "foreignField": "_id",
                        "as": "activities"
                    }
                },
                {
                    "$limit": 1
                }
            ],
            projection_model=AggregationUser
        ).to_list()
        
        return None if users is None or len(users) < 1 else users[0]
    
    @staticmethod
    async def get_aggregated_users_from_db() -> AggregationUser | None:
        users = await UserModel.find().aggregate(
            [
                {
                    "$lookup": {
                        "from": "activities",
                        "localField": "activities",
                        "foreignField": "_id",
                        "as": "activities"
                    }
                }
            ],
            projection_model=AggregationUser
        ).to_list()
        
        return None if users is None or len(users) < 1 else users