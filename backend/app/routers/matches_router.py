import geopy.distance

from beanie.operators import In
from bson import ObjectId
from http.client import HTTPException
from typing import List
from fastapi import APIRouter, Depends, Form
from app import config
from app.database.models.activity_model import ActivityModel
from app.database.models.match_model import MatchModel
from app.dependencies.auth import auth_required
from app.helpers.fields_validator import FieldValidator
from app.helpers.user_helper import UserHelper
from app.models.enums.subcription_level import SubscriptionLevel
from app.models.user import User
from app.routers.models.matches_response import Match, MatchesResponse
from app.services.geocoding_service import GeocodingService


router = APIRouter(
    prefix="/api/" + config.APP_VERSION + "/matches",
    tags=["matches"]
)

# TODO: Create Service for Matches (for functions with aggregation)
async def get_user_matches(user: User) -> List[Match]:
    matches = await MatchModel.find(MatchModel.user == user.id).aggregate(
        [
            {
                "$lookup": {
                    "from": "users",
                    "localField": "match",
                    "foreignField": "_id",
                    "as": "match",
                    "pipeline": [
                        {
                            "$lookup": {
                                "from": "activities",
                                "localField": "activities",
                                "foreignField": "_id",
                                "as": "activities"
                            }
                        }
                    ]
                }
            },
            {"$unwind": '$match'},
            {
                "$project": {
                    "user": "$match"   
                }
            }
        ],
        projection_model=Match
    ).to_list()
    
    for match in matches:
        if match.match.activities is None or user.activities is None:
            continue
        
        match.shared_activities = [activity for activity in user.activities if activity in match.match.activities]
    
    return matches


# TODO: Refactor search_filtered_matches method
async def search_filtered_matches(
    user: User,
    address: str | None = None,
    min_distance: int | None = None,
    max_distance: int | None = None,
    activities: List[ActivityModel] | None = None
) -> List[Match]:
    if user is None:
        raise HTTPException(status_code=401, detail={"message": "Authorization token is missing or invalid"})
    
    proper_activities = activities if activities is not None else user.activities
    
    users = await UserHelper.get_aggregated_users_from_db()
    matches: List[Match] = []
    
    if proper_activities is None:
        return []
    
    for possible_match in users:
        if possible_match.activities is None or possible_match.id == user.id:
            continue
        
        shared_activities = [activity for activity in proper_activities if activity in possible_match.activities]
        
        if len(shared_activities) > 0:
            matches.append(Match(user=possible_match, shared_activities=shared_activities))
    
    filtered_matches: List[Match] | None = None
        
    if address is not None and (min_distance is not None or max_distance is not None):
        filtered_matches = []
        coordinates = GeocodingService.geocode_address(address)
        
        if coordinates is not None:
            for match in matches:
                match_coordinates = GeocodingService.geocode_address(match.match.address)
                
                if match_coordinates is None:
                    continue
                
                distance = geopy.distance.geodesic((coordinates.x, coordinates.y), (match_coordinates.x, match_coordinates.y)).km
                
                if min_distance is not None and distance >= min_distance and max_distance is not None and distance <= max_distance:
                    filtered_matches.append(match)
                    
    return matches if filtered_matches is None else filtered_matches


@router.get("/", response_model=MatchesResponse)
async def get_matches(user: User = Depends(auth_required)):
    return MatchesResponse(
        matches=await get_user_matches(user)
    )

@router.post("/search", response_model=MatchesResponse)
async def search_matches(
    address: str = Form(default=""),
    mindistance: int = Form(default=0),
    maxdistance: int = Form(default=50),
    activities: List[str] = Form(default=[]),
    user: User = Depends(auth_required)
):
    field_validator = FieldValidator()
    field_validator.add_required(address, "address")
    field_validator.add_required(mindistance, "mindistance")
    field_validator.add_required(maxdistance, "maxdistance")
    field_validator.add_required(activities, "activities")
    field_validator.validate()
    
    db_activities = await ActivityModel.find(In(ActivityModel.id, [ObjectId(activity) for activity in activities])).to_list()
    
    max_activities_amount = None if user is not None and user.subscription_level == SubscriptionLevel.Premium else 1
    field_validator.add_required(db_activities, "activities", max_amount=max_activities_amount)
    
    field_validator.validate()
    
    return MatchesResponse(
        matches=await search_filtered_matches(
            user=user,
            address=address,
            min_distance=mindistance,
            max_distance=maxdistance,
            activities=db_activities
        )
    )
