import datetime

from beanie.operators import In
from passlib.hash import argon2
from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, BackgroundTasks, Depends, Form, HTTPException, UploadFile
from app import config
from app.database.models.activity_model import ActivityModel
from app.database.models.user_model import UserModel
from app.dependencies.auth import auth_required
from app.helpers.fields_validator import FieldValidator
from app.helpers.file_helper import FileHelper
from app.helpers.user_helper import UserHelper
from app.models.address import Address
from app.models.enums.gender import Gender
from app.models.enums.subcription_level import SubscriptionLevel
from app.models.user import User
from app.routers.models.generic_message import GenericMessage
from app.services.geocoding_service import GeocodingService
from app.services.paypal_service import OrderStatus, PayPalService
from app.services.sendbird_service import SendbirdService


router = APIRouter(
    prefix="/api/" + config.APP_VERSION + "/users",
    tags=["users"]
)

@router.get("/self", response_model=User)
def get_own_user(user: User = Depends(auth_required)):
    return user

@router.put("/self", response_model=User)
async def update_own_user(
    background_tasks: BackgroundTasks,
    firstname: str = Form(default=""),
    lastname: str = Form(default=""),
    email: str = Form(default=""),
    password: str = Form(default=None),
    about: str = Form(default=""),
    gender: str = Form(default=""),
    activities: List[str] = Form(default=[]),
    address: str = Form(default=""),
    images: List[UploadFile] = Form(default=[]),
    user: User = Depends(auth_required)
):
    new_changes = False
    
    new_firstname: str | None = None
    new_lastname: str | None = None
    new_uploaded_images: List[str] | None = None
    
    field_validator = FieldValidator()
    
    db_user = await UserModel.find_one(UserModel.id == user.id)
    
    if gender is not None and len(gender) > 0:
        if gender not in Gender:
            field_validator.add("gender", "Provided gender is not currently supported")
            field_validator.validate()
        
        if Gender(gender) != user.gender:
            db_user.gender = gender
            new_changes = True    
    
    if images is not None and len(images) > 0:
        await field_validator.check_image_formats(images, "images")
    
        try:
            new_uploaded_images = await FileHelper.cloud_upload_user_files(str(db_user.id), images, background_tasks)
        except Exception:
            new_uploaded_images = [config.JWT_ISSUER + image for image in await FileHelper.upload_user_files(str(db_user.id), images, True)]
        
        if new_uploaded_images is None or len(new_uploaded_images) < 1:
            raise HTTPException(status_code=400, detail={"message": "Unable to process uploaded images. Please, contact support for assistance."})
            
        db_user.images = new_uploaded_images
        new_changes = True
    
    if firstname is not None and len(firstname.strip()) > 0 and user.firstname != firstname.strip():
        field_validator.add_required("firstname", firstname)
        db_user.firstname = firstname.strip()
        new_changes = True
    
    if lastname is not None and len(lastname.strip()) > 0 and user.lastname != lastname.strip():
        field_validator.add_required("lastname", lastname)
        db_user.lastname = lastname.strip()
        new_changes = True
    
    if email is not None and len(email.strip()) > 0 and user.email != email.strip():
        field_validator.add_required("email", email)
        db_user.email = email.strip()
        new_changes = True
    
    if password is not None and not argon2.verify(password, db_user.password):
        field_validator.add_regex(password, "password", config.PASSWORD_REGEX, "Password should be minimum 6 characters long, have 2 uppercase letters, 1 special character and 1 number")
        db_user.password = argon2.hash(password)
        new_changes = True
    
    if about is not None and len(about.strip()) > 0 and user.about != about.strip():
        db_user.about = about.strip()
        new_changes = True
    
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
            new_changes = True
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
        new_changes = True
    
    field_validator.validate()
    
    if new_firstname is not None or new_lastname is not None or new_uploaded_images is not None:
        background_tasks.add_task(
            SendbirdService.update_user,
            str(db_user.id),
            db_user.firstname,
            db_user.lastname,
            db_user.images[0] if db_user.images is not None and len(db_user.images) > 0 else None
        )
    
    if new_changes:
        await db_user.save_changes()
    
    return await UserHelper.get_aggregated_user_from_db(UserModel.id, user.id) if new_changes else user

@router.post("/subscribe", response_model=GenericMessage)
async def subscribe_to_premium(order_id: str = Form(default=""), user: User = Depends(auth_required)):
    field_validator = FieldValidator()
    field_validator.add_required(order_id, "order_id")
    field_validator.validate()
    
    order_info = PayPalService.get_order_info(order_id)
    
    if not order_info or (order_info.order_status != OrderStatus.Approved and order_info.order_status != OrderStatus.Completed):
        return GenericMessage(message="Unable to prove subscription purchase")
    
    db_user = await UserModel.find_one(UserModel.id == user.id)
    
    if order_info.purchase_price == 11:
        end_date = datetime.datetime.now() + datetime.timedelta(days=30 * 3)
    else:
        end_date = datetime.datetime.now() + datetime.timedelta(days=30)
    
    db_user.subscription_level = SubscriptionLevel.Premium
    db_user.subscription_end_date = end_date
    
    await db_user.save_changes()
    
    return GenericMessage(
        message=f"Congratulations! Subscription Level has been successfully upgraded to Premium until {end_date.strftime('%m/%d/%Y')}"
    )
