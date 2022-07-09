from typing import Any, Dict

from bson import ObjectId
from app.database.models.user_model import UserModel
from app.helpers.jwt_helper import JWTHelper


class UserHelper():
    @staticmethod
    async def get_user_from_token(token: str) -> UserModel | None:
        if not token:
            return None
        
        token_claims = JWTHelper.decode_token(token)
        
        if not token_claims:
            return None
        
        if token_claims.get("type", "refresh") == "refresh":
            return None
        
        user_id = token_claims.get("sub", "")
        
        if len(user_id) != 24:
            return None
        
        return await UserModel.find(UserModel.id == ObjectId(user_id)).first_or_none()