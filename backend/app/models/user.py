import datetime

from typing import List
from beanie import PydanticObjectId
from pydantic import BaseModel, Field
from app.database.models.activity_model import ActivityModel
from app.models.address import Address
from app.models.enums.gender import Gender
from app.models.enums.subcription_level import SubscriptionLevel


class User(BaseModel):
    id: PydanticObjectId = Field(alias="_id", title="id")
    firstname: str
    lastname: str
    email: str
    last_login: datetime.datetime
    about: str | None
    subscription_level: SubscriptionLevel
    subscription_end_date: datetime.datetime | None
    activities_change_date: datetime.datetime | None
    gender: Gender
    account_creation_date: datetime.datetime
    activities: List[ActivityModel] | None
    address: Address
    images: List[str]
    chat_access_token: str | None

class AggregationUser(User):
    password: str