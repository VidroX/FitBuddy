from enum import Enum
from app.models.enums.string_enum_meta import StringEnumMeta


class TokenType(str, Enum, metaclass=StringEnumMeta):
    Refresh = "refresh"
    Access = "access"