from pydantic import BaseModel
from app.models.user import User
from app.routers.models.tokens import Tokens


class TokenizedUserResponse(BaseModel):
    user: User
    tokens: Tokens