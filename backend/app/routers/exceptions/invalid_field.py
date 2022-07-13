from typing import List
from fastapi import HTTPException

from app.routers.models.validation_field import ValidationField


class InvalidFieldsException(HTTPException):
    def __init__(self, invalid_fields: List[ValidationField], *args: object) -> None:
        normalized_errors = []
        
        for invalid_field in invalid_fields:
            normalized_errors.append(invalid_field.dict())
        
        super().__init__(status_code=400, detail={"message": "Some fields have errors", "errors": normalized_errors}, *args)