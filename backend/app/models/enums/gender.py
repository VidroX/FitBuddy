from enum import Enum
from app.models.enums.string_enum_meta import StringEnumMeta


class Gender(str, Enum, metaclass=StringEnumMeta):
    Male = "M"
    Female = "F"
    NonBinary = "Non-binary"