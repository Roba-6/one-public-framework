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
    """
    MessageSchema Class.

    Represents the schema for a message, containing essential details like code,
    message, and additional information. Used primarily for standardizing message
    structures across applications.

    Attributes
    ----------
    code : str
        Code representing the message. Can be used to identify the type or category
        of the message.
    message : str
        The main textual content of the message.
    detail : Any or None
        Additional details relevant to the message. Can be any type of data to provide
        extended context. Default is None.
    """

    code: str = Field(
        title=_("Message Code"),
        description=_("Message Code Description"),
    )
    message: str = Field(
        title=_("Message"),
        description=_("Message Description"),
    )
    detail: Any | None = Field(
        default=None,
        title=_("Message Detail"),
        description=_("Message Detail Description"),
    )


class ResponseSchema(BaseModel, Generic[T]):
    """
    ResponseSchema class.

    Represents a generic response schema that encapsulates results, count of items,
    and optional detailed messages. This schema is designed to standardize and
    simplify the representation of responses across various use cases.

    Attributes
    ----------
    results : T or list of T or None
        The results of the response, which can be a single item of type T, a list
        of such items, or None when no results are available.
    count : int or None
        The count of items in the result set. This can be None when the count
        information is unavailable or irrelevant.
    detail : MessageSchema or None
        An optional field providing additional details or messaging about the
        response.
    """

    results: T | List[T] | None = Field(
        default=None,
        title=_("Result"),
        description=_("Result Description"),
    )
    count: int | None = Field(
        default=None,
        title=_("Count of Items"),
        description=_("Count of Items Description"),
    )
    detail: MessageSchema | None = Field(
        default=None,
        title=_("Detail of Result"),
        description=_("Detail of Result Description"),
    )
