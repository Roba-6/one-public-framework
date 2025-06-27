from typing import Any, Generic, List, TypeVar

from pydantic import BaseModel, Field
from sqlmodel import SQLModel

from one_public_api.core import translate as _

T = TypeVar("T")


class EmptyResponse(SQLModel):
    pass


class MessageSchema(BaseModel):
    code: str | None = Field(default=None, description=_("Message Code"))
    message: str = Field(description=_("Message of the response"))
    detail: Any | None = Field(default=None, description=_("Detail of the response"))


class ResponseSchema(BaseModel, Generic[T]):
    results: T | List[T] | None = Field(
        default=None, description=_("Results of the request")
    )
    count: int | None = Field(default=None, description=_("Count of the results"))
    detail: List[MessageSchema] | None = Field(
        default=None, description=_("Messages of the request")
    )
