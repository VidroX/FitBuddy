from fastapi import HTTPException, Request
from app.helpers.user_helper import UserHelper
from app.models.enums.token_type import TokenType
from app.models.user import User

error_details = {
    "message": "Authorization token is missing or invalid"
}

def extract_token(request: Request) -> str | None:
    token = request.headers.get("Authorization", None)
        
    if not token:
        return None
        
    if "Bearer" in token:
        token_parts = token.split(" ")
        token = token_parts[1] if len(token_parts) > 0 else None
        
    if not token or len(token) < 1:
         return None
     
    return token

async def auth_required(request: Request) -> User:
    token = extract_token(request)
    
    if not token:
        raise HTTPException(status_code=401, detail=error_details)
    
    user = await UserHelper.get_user_from_token(token, allowed_token_type=TokenType.Access)
        
    if not user:
        raise HTTPException(status_code=401, detail=error_details)
        
    return user

async def auth_optional(request: Request) -> User | None:
    token = extract_token(request)
    
    user = await UserHelper.get_user_from_token(token, allowed_token_type=TokenType.Access)
        
    return user

async def refresh_token_required(request: Request) -> User:
    token = extract_token(request)
    
    if not token:
        raise HTTPException(status_code=401, detail=error_details)
        
    user = await UserHelper.get_user_from_token(token, allowed_token_type=TokenType.Refresh)
        
    if not user:
        raise HTTPException(status_code=401, detail=error_details)
        
    return user