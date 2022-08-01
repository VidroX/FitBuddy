from typing import Any
from pydantic import BaseModel


class GenericMessage(BaseModel):
    message: str
    data: Any | None