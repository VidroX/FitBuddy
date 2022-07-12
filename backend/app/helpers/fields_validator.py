import re

from pathlib import Path
from PIL import Image, UnidentifiedImageError
from typing import Any, List
from starlette.datastructures import UploadFile
from app.routers.exceptions.invalid_field import InvalidFieldsException
from app.routers.models.validation_field import ValidationField


class FieldValidator():
    invalid_fields: List[ValidationField]
    
    def __init__(self) -> None:
        self.invalid_fields = []
        
    def _get_file_extension(self, filename: str) -> str:
        return Path(filename).suffix[1:] if len(filename) > 1 else ""
        
    def add(self, field_id: str, reason: str):
        self.invalid_fields.append(ValidationField(field_id=field_id, reason=reason))
        
    def add_required(self, field: Any, field_id: str):
        file_amount: int | None = None
        
        if field is not None and isinstance(field, list) and len(field) > 0 and isinstance(field[0], UploadFile):
            file_amount = 0
            
            for uploaded_file in field:
                if uploaded_file.filename != "":
                    file_amount += 1
        elif field is not None and isinstance(field, UploadFile):
            file_amount = 0 if field.filename == "" else 1
        
        has_errors = field is None or \
            (isinstance(field, str) and len(field.strip()) < 1) or \
            (isinstance(field, list) and len(field) < 1) or \
            (file_amount is not None and file_amount < 1)
        
        if has_errors:
            self.invalid_fields.append(ValidationField(field_id=field_id, reason="This field is required."))
    
    def add_regex(self, field: str, field_id: str, regex: str, reason: str):
        if regex is not None and not re.fullmatch(regex, field):
            self.invalid_fields.append(ValidationField(field_id=field_id, reason=reason))
    
    async def add_images(self, image_field: UploadFile | List[UploadFile], field_id: str):
        supported_formats = ["JPEG", "JPG", "PNG"]
        
        if image_field is not None and isinstance(image_field, list) and len(image_field) > 1:
            for uploaded_file in image_field:
                try:
                    if uploaded_file.filename == "":
                        continue
                    
                    img = Image.open(uploaded_file.file)
                    
                    if self._get_file_extension(uploaded_file.filename).upper() not in supported_formats or img.format not in supported_formats:
                        self.invalid_fields.append(ValidationField(field_id=field_id, reason="Some of the uploaded images have an unsupported format. Supported formats are: " + (", ".join(supported_formats))))
                        
                        break
                except UnidentifiedImageError:
                    self.invalid_fields.append(ValidationField(field_id=field_id, reason="Some of the uploaded images have an unsupported format. Supported formats are: " + (", ".join(supported_formats))))
                    break
            
            for uploaded_file in image_field:
                await uploaded_file.seek(0)
            
            return
        
        img: Image = None
        normalized_file: UploadFile = None
        
        try:
            if image_field is not None and isinstance(image_field, list) and len(image_field) == 1 and image_field[0].filename != "":
                img = Image.open(image_field[0].file)
                normalized_file = image_field[0]
            elif image_field is not None and not isinstance(image_field, list) and image_field.filename != "":
                img = Image.open(image_field.file)
                normalized_file = image_field

            if img is not None and normalized_file is not None and (self._get_file_extension(normalized_file.filename).upper() not in supported_formats or img.format not in supported_formats):
                self.invalid_fields.append(ValidationField(field_id=field_id, reason="Uploaded image has an unsupported format. Supported formats are: " + (", ".join(supported_formats))))
        except UnidentifiedImageError:
            self.invalid_fields.append(ValidationField(field_id=field_id, reason="Uploaded image has an unsupported format. Supported formats are: " + (", ".join(supported_formats))))
        
        if normalized_file is not None:
            await normalized_file.seek(0)
        
        
    def validate(self):
        if len(self.invalid_fields) > 0:
            raise InvalidFieldsException(invalid_fields=self.invalid_fields)
    
    def reset(self):
        self.invalid_fields = []