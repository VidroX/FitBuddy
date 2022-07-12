from datetime import datetime
from typing import List
from beanie import PydanticObjectId
from passlib.hash import argon2
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from app import config
from app.database.models.activity_model import ActivityModel
from app.database.models.user_model import UserModel
from app.dependencies.auth import refresh_token_required
from app.helpers.fields_validator import FieldValidator
from app.helpers.file_helper import FileHelper
from app.helpers.jwt_helper import JWTHelper
from app.models.enums.gender import Gender
from app.models.user import User
from app.routers.models.tokenized_user_response import TokenizedUserResponse
from app.routers.models.tokens import Tokens
from beanie.operators import In


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
    firstname: str = Form(default=""),
    lastname: str = Form(default=""),
    email: str = Form(default=""),
    password: str = Form(default=""),
    about: str = Form(default=""),
    gender: str = Form(default=""),
    activities: List[str] = Form(default=[]),
    address: str = Form(default=""),
    images: List[UploadFile] = Form(default=[]),
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
    
    await field_validator.add_images(images, "images")
    field_validator.add_regex(password, "password", r"^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,}$", "Password should be minimum 6 characters long, have 2 uppercase letters, 1 special character and 1 number")
    
    if gender not in Gender:
        field_validator.add("gender", "Provided gender is not currently supported")
    
    field_validator.validate()
    
    existing_user = await UserModel.find_one(UserModel.email == email)
    
    if existing_user is not None:
        raise HTTPException(status_code=400, detail={"message": "User with provided E-Mail already registered."})
    
    db_activities = await ActivityModel.find(In(ActivityModel.id, activities)).to_list()
    
    field_validator.add_required(db_activities, "activities")
    
    field_validator.validate()
    
    new_user = UserModel(
        id=PydanticObjectId(),
        firstname=firstname.strip(),
        lastname=lastname.strip(),
        email=email.strip(),
        password=argon2.hash(password),
        about=about.strip() if len(about.strip()) > 0 else None,
        gender=gender,
        activities=db_activities,
        last_login=datetime.now(),
        address=address
    )
    
    uploaded_images = await FileHelper.upload_user_files(str(new_user.id), images)
    
    if uploaded_images is None:
        raise HTTPException(status_code=400, detail={"message": "Unable to process uploaded images. Please, contact support for assistance."})
    
    new_user.images = [config.JWT_ISSUER + image for image in uploaded_images]
    
    await new_user.insert()
    
    return TokenizedUserResponse(
        user=User(**new_user.dict(exclude={'password': True, "id": True}), id=str(new_user.id)),
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
    
    db_user = await UserModel.find_one(UserModel.email == email, fetch_links=True)
    
    if not argon2.verify(password, db_user.password):
        raise HTTPException(status_code=400, detail={ "message": "User not found with provided E-Mail and Password combination." })
    
    db_user.last_login = datetime.now()
    
    await db_user.save_changes()
    
    return TokenizedUserResponse(
        user=User(**db_user.dict(exclude={'password': True, "id": True}), id=str(db_user.id)),
        tokens=Tokens(
            access=JWTHelper.encode_user_token(user_id=str(db_user.id), is_refresh=False),
            refresh=JWTHelper.encode_user_token(user_id=str(db_user.id), is_refresh=True)
        )
    )
