from datetime import datetime
from typing import List
from beanie import PydanticObjectId
from bson import ObjectId
from passlib.hash import argon2
from fastapi import APIRouter, BackgroundTasks, Depends, Form, HTTPException, UploadFile
from app import config
from app.database.models.activity_model import ActivityModel
from app.database.models.user_model import UserModel
from app.dependencies.auth import auth_optional, refresh_token_required
from app.helpers.fields_validator import FieldValidator
from app.helpers.file_helper import FileHelper
from app.helpers.jwt_helper import JWTHelper
from app.helpers.user_helper import UserHelper
from app.models.address import Address
from app.models.enums.gender import Gender
from app.models.enums.subcription_level import SubscriptionLevel
from app.models.user import User
from app.routers.models.tokenized_user_response import TokenizedUserResponse
from app.routers.models.tokens import Tokens
from beanie.operators import In
from app.services.geocoding_service import GeocodingService
from app.services.sendbird_service import SendbirdService


router = APIRouter(
    prefix="/api/" + config.APP_VERSION + "/auth",
    tags=["auth"]
)

@router.get("/refresh", response_model=Tokens)
async def refresh(user: User = Depends(refresh_token_required)):
    return Tokens(
        access=JWTHelper.encode_user_token(user_id=str(user.id), is_refresh=False),
        refresh=None
    )

@router.post("/register", response_model=TokenizedUserResponse)
async def register(
    background_tasks: BackgroundTasks,
    firstname: str = Form(default=""),
    lastname: str = Form(default=""),
    email: str = Form(default=""),
    password: str = Form(default=""),
    about: str = Form(default=""),
    gender: str = Form(default=""),
    activities: List[str] = Form(default=[]),
    address: str = Form(default=""),
    images: List[UploadFile] = Form(default=[]),
    user: User | None = Depends(auth_optional)
):
    field_validator = FieldValidator()
    
    field_validator.add_required(firstname, "firstname")
    field_validator.add_required(lastname, "lastname")
    field_validator.add_required(email, "email")
    field_validator.add_required(password, "password")
    field_validator.add_required(gender, "gender")
    field_validator.add_required(activities, "activities")
    field_validator.add_required(address, "address")
    field_validator.add_required(images, "images")
    
    field_validator.validate()
    
    await field_validator.check_image_formats(images, "images")
    field_validator.add_regex(password, "password", config.PASSWORD_REGEX, "Password should be minimum 6 characters long, have 2 uppercase letters, 1 special character and 1 number")
    
    if gender not in Gender:
        field_validator.add("gender", "Provided gender is not currently supported")
    
    existing_user = await UserModel.find_one(UserModel.email == email)
    
    if existing_user is not None:
        field_validator.add("email", "User with provided E-Mail already registered.")
        
    field_validator.validate()
    
    db_activities = await ActivityModel.find(In(ActivityModel.id, [ObjectId(activity) for activity in activities])).to_list()
    
    proper_activities = [PydanticObjectId(act.id) for act in db_activities]
    
    max_activities_amount = None if user is not None and user.subscription_level == SubscriptionLevel.Premium else 1
    field_validator.add_required(proper_activities, "activities", max_amount=max_activities_amount)
    
    field_validator.validate()
    
    address_coordinates = GeocodingService.geocode_address(address)
    
    new_user = UserModel(
        id=PydanticObjectId(),
        firstname=firstname.strip(),
        lastname=lastname.strip(),
        email=email.strip(),
        password=argon2.hash(password),
        about=about.strip() if len(about.strip()) > 0 else None,
        gender=gender,
        activities=proper_activities,
        last_login=datetime.now(),
        activities_change_date=datetime.now(),
        address=Address(
            name=address,
            coordinates=address_coordinates
        )
    )
    
    uploaded_images: List[str] | None = None
    
    try:
        uploaded_images = await FileHelper.cloud_upload_user_files(str(new_user.id), images, background_tasks)
    except Exception:
        uploaded_images = [config.JWT_ISSUER + image for image in await FileHelper.upload_user_files(str(new_user.id), images, True)]
    
    if uploaded_images is None or len(uploaded_images) < 1:
        raise HTTPException(status_code=400, detail={"message": "Unable to process uploaded images. Please, contact support for assistance."})
        
    new_user.images = uploaded_images
    new_user.chat_access_token = SendbirdService.create_user(str(new_user.id), new_user.firstname, new_user.lastname, uploaded_images[0])
    
    await new_user.insert()
    
    return TokenizedUserResponse(
        user=User(**new_user.dict(exclude={'password': True, "activities": True}),
            _id=new_user.id,
            activities=await ActivityModel.find(In(ActivityModel.id, proper_activities)).to_list()
        ),
        tokens=Tokens(
            access=JWTHelper.encode_user_token(user_id=str(new_user.id), is_refresh=False),
            refresh=JWTHelper.encode_user_token(user_id=str(new_user.id), is_refresh=True)
        )
    )

@router.post("/login", response_model=TokenizedUserResponse)
async def login(email: str = Form(default=""), password: str = Form(default="")):
    field_validator = FieldValidator()
    field_validator.add_required(email, "email")
    field_validator.add_required(password, "password")
    field_validator.validate()
    
    db_user = await UserModel.find_one(UserModel.email == email)
    
    if not db_user or not argon2.verify(password, db_user.password):
        raise HTTPException(status_code=400, detail={ "message": "User not found with provided E-Mail and Password combination." })
    
    last_login_time = datetime.now()
    
    db_user.last_login = last_login_time
    
    user_data = await UserHelper.get_aggregated_user_from_db(UserModel.id, db_user.id)
    
    await db_user.save_changes()
    
    return TokenizedUserResponse(
        user=User(**user_data.dict(exclude={"last_login": True}), last_login=last_login_time, _id=db_user.id),
        tokens=Tokens(
            access=JWTHelper.encode_user_token(user_id=str(db_user.id), is_refresh=False),
            refresh=JWTHelper.encode_user_token(user_id=str(db_user.id), is_refresh=True)
        )
    )
