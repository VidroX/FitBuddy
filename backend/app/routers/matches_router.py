from beanie import PydanticObjectId
from beanie.operators import In, Or, And
from bson import ObjectId
from typing import List
from fastapi import APIRouter, BackgroundTasks, Depends, Form, HTTPException
from app import config
from app.database.models.activity_model import ActivityModel
from app.database.models.match_model import MatchModel
from app.dependencies.auth import auth_required
from app.helpers.fields_validator import FieldValidator
from app.models.enums.subcription_level import SubscriptionLevel
from app.models.user import User
from app.routers.models.acceptance_match_message import AcceptanceMatchMessage
from app.routers.models.match_message import MatchMessage
from app.routers.models.matches_response import MatchesResponse
from app.routers.services.matching_service import MatchingService
from app.services.sendbird_service import SendbirdService


router = APIRouter(
    prefix="/api/" + config.APP_VERSION + "/matches",
    tags=["matches"]
)

@router.get("/", response_model=MatchesResponse)
async def get_matches(user: User = Depends(auth_required)):
    return MatchesResponse(
        matches=await MatchingService.get_user_matches(user)
    )


@router.get("/pending", response_model=MatchesResponse)
async def get_pending_matches(user: User = Depends(auth_required)):
    return MatchesResponse(
        matches=await MatchingService.get_user_matches(user, True)
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
        matches=await MatchingService.search_filtered_matches(
            user=user,
            address=address,
            min_distance=mindistance,
            max_distance=maxdistance,
            activities=db_activities
        )
    )


@router.post("/accept", response_model=AcceptanceMatchMessage)
async def accept_match(
    background_tasks: BackgroundTasks,
    match_id: str = Form(default=""),
    activities: List[str] = Form(default=[]),
    user: User = Depends(auth_required)
):
    field_validator = FieldValidator()
    field_validator.add_required(match_id, "match")
    field_validator.validate()
    
    if PydanticObjectId(match_id) == user.id:
        raise HTTPException(status_code=400, detail={"message": "Provided user is restricted to be accepted or user was already accepted!"})
    
    if len(activities) < 1:
        activities = None
    else:
        db_activities = await ActivityModel.find(In(ActivityModel.id, [ObjectId(activity) for activity in activities])).to_list()
    
        max_activities_amount = None if user is not None and user.subscription_level == SubscriptionLevel.Premium else 1
        field_validator.add_required(db_activities, "activities", max_amount=max_activities_amount)
        
        field_validator.validate()
        
        activities = db_activities
    
    possible_match = await MatchingService.get_possible_match(user, match_id, activities)
    
    if possible_match is None:
        raise HTTPException(status_code=400, detail={"message": "Provided user is restricted to be accepted or user was already accepted!"})
    
    existing_match = await MatchModel.find_one(
        And(
            Or(MatchModel.user1 == user.id, MatchModel.user2 == user.id),
            Or(MatchModel.user1 == possible_match.match.id, MatchModel.user2 == possible_match.match.id)
        )
    )
    
    new_match = False
    
    if existing_match is None:
        existing_match = MatchModel(
            user1=user.id,
            user2=possible_match.match.id,
            user1_accepted=True,
            user2_accepted=None
        )
        
        await existing_match.insert()
        
        new_match = True
        
    if existing_match.user1_accepted == False or existing_match.user2_accepted == False or \
        (not new_match and existing_match.user1_accepted == True and existing_match.user1 == user.id) or \
        (not new_match and existing_match.user2_accepted == True and existing_match.user2 == user.id):
        raise HTTPException(status_code=400, detail={"message": "Provided user is restricted to be accepted or user was already accepted!"})
    
    if not new_match and existing_match.user1_accepted is None and existing_match.user1 == user.id:
        existing_match.user1_accepted = True
    elif not new_match and existing_match.user2_accepted is None and existing_match.user2 == user.id:
        existing_match.user2_accepted = True
    
    if not new_match:
        await existing_match.save_changes()
    
    is_mutually_accepted = existing_match.user1_accepted == True and existing_match.user2_accepted == True
    
    if is_mutually_accepted:
        background_tasks.add_task(
            SendbirdService.create_channel,
            str(existing_match.id),
            f"{possible_match.match.firstname} {possible_match.match.lastname} | {user.firstname} {user.lastname}",
            [str(existing_match.user1), str(existing_match.user2)]
        )
    
    return AcceptanceMatchMessage(
        message="It's a mutual match!" if is_mutually_accepted else "You have successfully accepted match suggestion!",
        match=possible_match,
        is_mutually_accepted=is_mutually_accepted
    )


@router.post("/reject", response_model=MatchMessage)
async def reject_match(
    match_id: str = Form(default=""),
    activities: List[str] = Form(default=[]),
    user: User = Depends(auth_required)
):
    field_validator = FieldValidator()
    field_validator.add_required(match_id, "match")
    field_validator.validate()
    
    if PydanticObjectId(match_id) == user.id:
        raise HTTPException(status_code=400, detail={"message": "Provided user is restricted to be rejected or user was already rejected!"})
    
    if len(activities) < 1:
        activities = None
    else:
        db_activities = await ActivityModel.find(In(ActivityModel.id, [ObjectId(activity) for activity in activities])).to_list()
    
        max_activities_amount = None if user is not None and user.subscription_level == SubscriptionLevel.Premium else 1
        field_validator.add_required(db_activities, "activities", max_amount=max_activities_amount)
        
        field_validator.validate()
        
        activities = db_activities
    
    possible_match = await MatchingService.get_possible_match(user, match_id, activities)
    
    if possible_match is None:
        raise HTTPException(status_code=400, detail={"message": "Provided user is restricted to be rejected or user was already rejected!"})
    
    existing_match = await MatchModel.find_one(
        And(
            Or(MatchModel.user1 == user.id, MatchModel.user2 == user.id),
            Or(MatchModel.user1 == possible_match.match.id, MatchModel.user2 == possible_match.match.id)
        )
    )
    
    new_match = False
    
    if existing_match is None:
        existing_match = MatchModel(
            user1=user.id,
            user2=possible_match.match.id,
            user1_accepted=False,
            user2_accepted=None
        )
        
        await existing_match.insert()
        
        new_match = True
        
    if (not new_match and existing_match.user1_accepted is not None and existing_match.user1 == user.id) or \
        (not new_match and existing_match.user2_accepted is not None and existing_match.user2 == user.id):
        raise HTTPException(status_code=400, detail={"message": "Provided user is restricted to be rejected or user was already rejected!"})
    
    if not new_match and existing_match.user1_accepted is None and existing_match.user1 == user.id:
        existing_match.user1_accepted = False
    elif not new_match and existing_match.user2_accepted is None and existing_match.user2 == user.id:
        existing_match.user2_accepted = False
    
    if not new_match:
        await existing_match.save_changes()
    
    return MatchMessage(
        message="You have successfully rejected match suggestion!",
        match=possible_match
    )
