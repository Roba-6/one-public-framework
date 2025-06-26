from http.client import HTTPException
from typing import Annotated, Any, List, Type, TypeVar

import jwt
from fastapi import Depends
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlmodel import SQLModel

from one_public_api.common import constants
from one_public_api.core import settings
from one_public_api.core.exceptions import UnauthorizedError
from one_public_api.core.extensions import oauth2_scheme
from one_public_api.models import User
from one_public_api.schemas.response_schema import MessageSchema, ResponseSchema
from one_public_api.services.user_service import UserService

T = TypeVar("T", bound=SQLModel)


def create_response_data(
    schema: Type[T] | None,
    results: Any | List[Any] | None,
    count: int | None = None,
    detail: List[MessageSchema] | None = None,
) -> ResponseSchema[T]:
    """
    Creates a response data object compliant with the `ResponseSchema[T]`
    model.

    This method validates the provided results data against the
    specified schema and then encapsulates it in a standardized response
    object. It supports single or multiple data results by handling both
    individual and list inputs. Optionally, it includes additional metadata
    such as count and detailed message schema.

    Parameters
    ----------
    schema : Type[T] or None
        The schema model used to validate the provided results data. This should be
        callable with a
        `model_validate` method to perform validation.
    results : Any or List[Any] or None
        The data object(s) to be validated and included in the response. It can be a
        single instance,
        a list of instances, or None.
    count : int or None, optional
        The count metadata is typically used to indicate the total number of items in a
        paginated context, or can be None if not applicable.
    detail : List[MessageSchema] or None, optional
        A list of detail messages that provide additional information regarding the
        response or process, or can be None if no details are provided.

    Returns
    -------
    ResponseSchema[T]
        A response object containing the validated results data, optional count
        metadata, and optional detailed messages.
    """

    if type(results) is list:
        rst = [getattr(schema, "model_validate")(d) for d in results]
    elif results is None:
        rst = None
    else:
        rst = getattr(schema, "model_validate")(results)

    rsp: ResponseSchema[T] = ResponseSchema(results=rst, count=count, detail=detail)

    return rsp


def get_current_user(
    us: Annotated[UserService, Depends()],
    token: str = Depends(oauth2_scheme),
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[constants.JWT_ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise UnauthorizedError(
                "No user information found in the token", token, "E40100003"
            )
        else:
            return us.get_one(
                {"name": username, "is_disabled": False, "is_locked": False}
            )
    except ExpiredSignatureError:
        raise UnauthorizedError("The token has expired", token, "E40100004")
    except InvalidTokenError:
        raise UnauthorizedError("Invalid token", token, "E40100005")
    except HTTPException:
        raise UnauthorizedError("user not found", token, "E40100006")
