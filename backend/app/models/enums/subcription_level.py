from enum import Enum
from app.models.enums.string_enum_meta import StringEnumMeta


class SubscriptionLevel(str, Enum, metaclass=StringEnumMeta):
    Free = "free"
    Premium = "premium"