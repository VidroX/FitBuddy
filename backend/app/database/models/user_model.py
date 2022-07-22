import datetime

from typing import List
from beanie import Document, Indexed, PydanticObjectId
from app.models.address import Address
from app.models.enums.gender import Gender
from app.models.enums.subcription_level import SubscriptionLevel


class UserModel(Document):
    firstname: str
    lastname: str
    email: Indexed(str, unique=True)
    last_login: datetime.datetime
    about: str | None
    subscription_level: SubscriptionLevel = SubscriptionLevel.Free
    subscription_end_date: datetime.datetime | None
    activities_change_date: datetime.datetime | None
    gender: Gender
    password: str
    account_creation_date: datetime.datetime = datetime.datetime.now()
    activities: List[PydanticObjectId] | None
    address: Address
    images: List[str] | None
    chat_access_token: str | None
    
    class Settings:
        name = "users"
        use_state_management = True