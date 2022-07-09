from datetime import datetime
from typing import List
from passlib.hash import argon2
from fastapi import APIRouter, Form, HTTPException, UploadFile
from app.database.models.activity_model import ActivityModel
from app.database.models.user_model import UserModel
from app.helpers.fields_validator import FieldValidator
from app.helpers.jwt_helper import JWTHelper
from app.models.gender import Gender
from app.models.user import User
from app.routers.models.tokenized_user_response import TokenizedUserResponse
from app.routers.models.tokens import Tokens
from beanie.operators import In


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
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
    # TODO: Add image upload
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
    
    field_validator.add_regex(password, "password", r"^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,}$", "Password should be minimum 6 characters long, have 2 uppercase letters, 1 special character and 1 number")
    
    if gender not in Gender:
        field_validator.add("gender", "Provided gender is not currently supported")
    
    field_validator.validate()
    
    existing_user = await UserModel.find_one(UserModel.email == email)
    
    if existing_user is not None:
        raise HTTPException(status_code=400, detail={ "message": "User with provided E-Mail already registered." })
    
    activities = await ActivityModel.find(In(ActivityModel.id, activities)).to_list()
    
    new_user = UserModel(
        firstname=firstname.strip(),
        lastname=lastname.strip(),
        email=email.strip(),
        password=argon2.hash(password),
        about=about.strip() if len(about.strip()) > 0 else None,
        gender=gender,
        activities=activities,
        last_login=datetime.now(),
        address=address,
        images=[],   
    )
    
    await new_user.insert()
    
    return TokenizedUserResponse(
        user=new_user,
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
    
    await db_user.save()
    
    return TokenizedUserResponse(
        user=User(**db_user.dict(exclude={'password': True})),
        tokens=Tokens(
            access=JWTHelper.encode_user_token(user_id=str(db_user.id), is_refresh=False),
            refresh=JWTHelper.encode_user_token(user_id=str(db_user.id), is_refresh=True)
        )
    )
