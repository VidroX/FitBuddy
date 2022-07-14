from bson import ObjectId
from fastapi import APIRouter, Depends
from app import config
from app.database.models.match_model import MatchModel
from app.database.models.user_model import UserModel
from app.dependencies.auth import auth_required
from app.models.user import User
from app.routers.models.matches_response import Match, MatchesResponse


router = APIRouter(
    prefix="/api/" + config.APP_VERSION + "/matches",
    tags=["matches"]
)

@router.get("/", response_model=MatchesResponse)
async def get_matches(user: User = Depends(auth_required)):
    user_matches = await MatchModel.find(MatchModel.user.id == ObjectId(user.id), fetch_links=True).to_list()
    
    match_map: Match = []
    for user_match in user_matches:
        match_user = User(**user_match.match.dict(exclude={"password": True, "id": True, "activities": True}), id=str(user.id))
        match_map.append(
            Match(
                user=match_user,
                common_activities=user_match.common_activities
            )
        )
    
    return MatchesResponse(
        matches=match_map
    )
