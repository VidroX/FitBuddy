import re

from typing import Any, List
from app.routers.exceptions.invalid_field import InvalidFieldsException
from app.routers.models.validation_field import ValidationField


class FieldValidator():
    invalid_fields: List[ValidationField]
    
    def __init__(self) -> None:
        self.invalid_fields = []
        
    def add(self, field_id: str, reason: str):
        self.invalid_fields.append(ValidationField(field_id=field_id, reason=reason))
        
    def add_required(self, field: Any, field_id: str, regex: str | None = None):
        if field is None or (isinstance(field, str) and len(field.strip()) < 1) or (isinstance(field, list) and len(field) < 1):
            self.invalid_fields.append(ValidationField(field_id=field_id, reason="This field is required."))
    
    def add_regex(self, field: str, field_id: str, regex: str, reason: str):
        if regex is not None and not re.fullmatch(regex, field):
            self.invalid_fields.append(ValidationField(field_id=field_id, reason=reason))
        
    def validate(self):
        if len(self.invalid_fields) > 0:
            raise InvalidFieldsException(invalid_fields=self.invalid_fields)
    
    def reset(self):
        self.invalid_fields = []