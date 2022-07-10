import datetime

from typing import List
from beanie import Document, Link
from app.database.models.activity_model import ActivityModel
from app.models.enums.gender import Gender
from app.models.enums.subcription_level import SubscriptionLevel


class UserModel(Document):
    firstname: str
    lastname: str
    email: str
    last_login: datetime.datetime
    about: str | None
    subscription_level: SubscriptionLevel = SubscriptionLevel.Free
    subscription_end_date: datetime.datetime | None
    gender: Gender
    password: str
    account_creation_date: datetime.datetime = datetime.datetime.now()
    activities: List[Link[ActivityModel]] | None
    address: str
    images: List[str] | None
    
    class Settings:
        name = "users"
        use_state_management = True