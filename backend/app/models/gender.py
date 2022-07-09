from enum import Enum
from app.models.string_enum_meta import StringEnumMeta


class Gender(str, Enum, metaclass=StringEnumMeta):
    Male = "m"
    Female = "f"
    NonBinary = "nb"