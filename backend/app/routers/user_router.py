from fastapi import APIRouter, Depends
from app.dependencies.auth import auth_required
from app.models.user import User


router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/self")
def get_own_user(user: User = Depends(auth_required)):
    return user
