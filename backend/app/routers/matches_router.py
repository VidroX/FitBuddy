import datetime


from beanie import PydanticObjectId
from beanie.operators import In, Or, And
from typing import List
from fastapi import APIRouter, BackgroundTasks, Depends, Form, HTTPException
from app import config
from app.database.models.activity_model import ActivityModel
from app.database.models.match_model import MatchModel
from app.database.models.user_model import UserModel
from app.dependencies.auth import auth_required
from app.helpers.fields_validator import FieldValidator
from app.models.address import Address
from app.models.enums.subcription_level import SubscriptionLevel
from app.models.user import User
from app.routers.models.acceptance_match_message import AcceptanceMatchMessage
from app.routers.models.match_message import MatchMessage
from app.routers.models.matches_response import MatchesResponse
from app.routers.services.matching_service import MatchingService
from app.services.geocoding_service import GeocodingService
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
    
    user_changed = False
    
    db_user = await UserModel.find_one(UserModel.id == user.id)
    
    if activities is not None and len(activities) > 0:    
        db_activities = await ActivityModel.find(In(ActivityModel.id, [PydanticObjectId(activity) for activity in activities])).to_list()
        
        proper_activities = [PydanticObjectId(act.id) for act in db_activities]
        user_activities = [PydanticObjectId(act.id) for act in user.activities]
        
        if user.activities_change_date is None:
            can_update_activities = True
        else:
            diff = datetime.datetime.now() - user.activities_change_date
            can_update_activities = divmod(diff.total_seconds(), 86400)[0] > 29 or user.subscription_level == SubscriptionLevel.Premium
        
        if proper_activities != user_activities and can_update_activities:
            max_activities_amount = None if user.subscription_level == SubscriptionLevel.Premium else 1
            field_validator.add_required(proper_activities, "activities", max_amount=max_activities_amount)
            db_user.activities = proper_activities 
            db_user.activities_change_date = datetime.datetime.now()
            user_changed = True
        elif proper_activities != user_activities and not can_update_activities:
            field_validator.add("activities", "You can only update your activities once a month. Consider upgrading to Premium to bypass this restriction.")
    
    if address is not None and len(address.strip()) > 0 and user.address.name != address.strip():
        stripped_address = address.strip()
        
        field_validator.add_required("address", stripped_address)
        field_validator.validate()
        
        db_user.address = Address(
            name=stripped_address,
            coordinates=GeocodingService.geocode_address(stripped_address)
        )
        user_changed = True
    
    field_validator.validate()
    
    if user_changed:
        await db_user.save_changes()
    
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
    user: User = Depends(auth_required)
):
    field_validator = FieldValidator()
    field_validator.add_required(match_id, "match")
    field_validator.validate()
    
    if PydanticObjectId(match_id) == user.id:
        raise HTTPException(status_code=400, detail={"message": "Provided user is restricted to be accepted or user was already accepted!"})
    
    possible_match = await MatchingService.get_possible_match(user, match_id, None)
    
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
    user: User = Depends(auth_required)
):
    field_validator = FieldValidator()
    field_validator.add_required(match_id, "match")
    field_validator.validate()
    
    if PydanticObjectId(match_id) == user.id:
        raise HTTPException(status_code=400, detail={"message": "Provided user is restricted to be rejected or user was already rejected!"})
    
    possible_match = await MatchingService.get_possible_match(user, match_id, None)
    
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
