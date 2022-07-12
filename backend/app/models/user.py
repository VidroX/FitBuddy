import datetime

from typing import List
from pydantic import BaseModel
from app.database.models.activity_model import ActivityModel
from app.models.enums.gender import Gender
from app.models.enums.subcription_level import SubscriptionLevel


class User(BaseModel):
    id: str
    firstname: str
    lastname: str
    email: str
    last_login: datetime.datetime
    about: str | None
    subscription_level: SubscriptionLevel
    subscription_end_date: datetime.datetime | None
    gender: Gender
    account_creation_date: datetime.datetime
    activities: List[ActivityModel] | None
    address: str
    images: List[str]