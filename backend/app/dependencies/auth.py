from fastapi import HTTPException, Request
from app.database.models.user_model import UserModel
from app.helpers.user_helper import UserHelper
from app.models.user import User


async def auth_required(request: Request) -> User:
    token = request.headers.get("Authorization", None)
        
    if not token:
        raise HTTPException(status_code=401, detail="Authorization token is missing or invalid")
        
    if "Bearer" in token:
        token_parts = token.split(" ")
        token = token_parts[1] if len(token_parts) > 0 else None
        
    if not token or len(token) < 1:
         raise HTTPException(status_code=401, detail="Authorization token is missing or invalid")
        
    user = await UserHelper.get_user_from_token(token)
        
    if not user:
        raise HTTPException(status_code=401, detail="Authorization token is missing or invalid")
        
    return User(**user.dict(exclude={'password': True}))