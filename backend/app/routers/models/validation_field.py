from pydantic import BaseModel


class ValidationField(BaseModel):
    field_id: str
    reason: str

    def __str__(self) -> str:
        return self.name