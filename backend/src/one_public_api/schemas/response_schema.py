from typing import Any, Dict, Generic, List, TypeVar

from pydantic import BaseModel, Field
from sqlmodel import SQLModel

from one_public_api.core.i18n import translate as _

T = TypeVar("T")


example_id: Dict[str, Any] = {"id": "a83ab523-0a9e-4136-9602-f16a35c955a6"}

example_audit: Dict[str, Any] = {
    # "createdBy": "a83ab523-0a9e-4136-9602-f16a35c955a6",
    "createdAt": "2023-01-01T00:00:00+00:00",
    # "updatedBy": "a83ab523-0a9e-4136-9602-f16a35c955a6",
    "updatedAt": "2023-01-01T00:00:00+00:00",
}


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
        default=None, description=_("Details of the results")
    )
