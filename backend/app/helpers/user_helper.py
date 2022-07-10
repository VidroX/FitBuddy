from bson import ObjectId
from app.database.models.user_model import UserModel
from app.helpers.jwt_helper import JWTHelper
from app.models.enums.token_type import TokenType


class UserHelper():
    @staticmethod
    async def get_user_from_token(token: str, allowed_token_type: TokenType = TokenType.Access) -> UserModel | None:
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
        
        return await UserModel.find(UserModel.id == ObjectId(user_id)).first_or_none()