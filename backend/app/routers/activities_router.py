from fastapi import APIRouter
from app import config
from app.database.models.activity_model import ActivityModel
from app.routers.models.activities_response import ActivitiesResponse


router = APIRouter(
    prefix="/api/" + config.APP_VERSION + "/activities",
    tags=["auth"]
)

@router.get("/", response_model=ActivitiesResponse)
async def get_activities():
    return ActivitiesResponse(
        activities=await ActivityModel.find().to_list()
    )
