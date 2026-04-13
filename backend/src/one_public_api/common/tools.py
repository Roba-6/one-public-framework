import importlib.util
from glob import glob
from typing import Any, Awaitable, Callable, List, Type, TypeVar, cast

import jwt
from fastapi import FastAPI, Request, Response
from sqlmodel import SQLModel

from one_public_api.common import constants
from one_public_api.core.settings import settings
from one_public_api.schemas.response_schema import MessageSchema, ResponseSchema

T = TypeVar("T", bound=SQLModel)


def create_response_data(
    schema: Type[T],
    results: Any | List[Any] | None = None,
    count: int | None = None,
    detail: MessageSchema | None = None,
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
    schema
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
    detail : MessageSchema or None, optional
        A detail message that provides additional information regarding the response
        or process, or can be None if no details are provided.

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


def get_username_from_token(token: str) -> str | None:
    """
    Decodes a JWT token to extract the username.

    This function decodes a JSON Web Token (JWT) using a secret key and retrieves
    the subject (`sub`) from the payload. If the subject is not present in the
    payload, the function returns `None`.

    Parameters
    ----------
    token : str
        A JWT token to be decoded.

    Returns
    -------
    str | None
        The username extracted from the token's payload, or `None` if the
        subject (`sub`) is not found.
    """

    payload = jwt.decode(
        token, settings.SECRET_KEY, algorithms=[constants.JWT_ALGORITHM]
    )

    return str(payload.get("sub")) if payload.get("sub") else None


def load_router(app: FastAPI, input_dir: str) -> None:
    """
    Dynamically loads and includes routers into a FastAPI application.

    This function scans the specified directory for Python modules, dynamically imports
    them, and looks for specific router objects (`public_router` and `admin_router`)
    within these modules. When found, it includes these routers in the given FastAPI
    application. This allows for dynamic and modular management of routes across the
    application.

    Parameters
    ----------
    app : FastAPI
        The FastAPI application instance to which the routers are registered.
    input_dir : str
        The directory path to scan for Python modules containing router definitions.

    Returns
    -------
    None
        This function does not return any value.
    """

    for file in glob(input_dir, recursive=True):
        spec = importlib.util.spec_from_file_location("routers", file)
        if spec:
            mod = importlib.util.module_from_spec(spec)
            if spec.loader and mod:
                spec.loader.exec_module(mod)
                if hasattr(mod, "admin_router"):
                    app.include_router(
                        mod.admin_router, prefix=mod.prefix, tags=mod.tags
                    )
                if hasattr(mod, "public_router"):
                    if settings.APP_TYPE == "cms" or mod.prefix == "/auth":
                        app.include_router(
                            mod.public_router, prefix=mod.prefix, tags=mod.tags
                        )


def load_route_handler(
    input_dir: str, module_name: str, handler_name: str
) -> (
    Callable[[Request, Callable[[Request], Awaitable[Response]]], Awaitable[Response]]
    | None
):
    """
    Loads a route handler function dynamically from a specified module.

    This function searches for a module by its name within a given directory and
    attempts to load and instantiate a function (route handler) with a given name.
    If a matching handler cannot be found, the function returns None.

    Parameters
    ----------
    input_dir : str
        The directory to recursively search for the module file.
    module_name : str
        The name of the module to locate and load.
    handler_name : str
        The name of the handler function to retrieve from the module.

    Returns
    -------
        The route handler function if found; otherwise, None. The handler function
        is expected to accept a `Request` object and a callable as parameters and
        return an awaitable `Response` object.
    """

    for file in glob(input_dir, recursive=True):
        spec = importlib.util.spec_from_file_location(module_name, file)
        if spec:
            mod = importlib.util.module_from_spec(spec)
            if spec.loader and mod:
                spec.loader.exec_module(mod)
                return cast(
                    Callable[
                        [Request, Callable[[Request], Awaitable[Response]]],
                        Awaitable[Response],
                    ],
                    getattr(mod, handler_name),
                )

    return None
