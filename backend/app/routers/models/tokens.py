from pydantic import BaseModel


class Tokens(BaseModel):
    access: str
    refresh: str | None