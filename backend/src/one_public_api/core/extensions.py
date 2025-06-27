from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import inspect

from one_public_api.common import constants
from one_public_api.common.init_data import (
    init_configurations,
    init_features,
    init_users,
)
from one_public_api.core.database import engine, session
from one_public_api.core.i18n import translate as _
from one_public_api.core.log import logger
from one_public_api.core.settings import settings


def initialize(app: FastAPI) -> None:
    """
    Initializes the FastAPI application with middleware and configuration
    settings.

    This function configures the given FastAPI application by setting up necessary
    middleware and applying the relevant settings for CORS (Cross-Origin Resource
    Sharing). It also logs the initialization process for debugging purposes.

    Parameters
    ----------
    app : FastAPI
        The FastAPI application instance to be configured.

    Returns
    -------
    None
        This function does not return any value.
    """

    logger.debug(_("D0010001") % {"settings": settings})
    if settings.CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,  # noqa
            allow_origins=[str(origin).strip("/") for origin in settings.CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, Any]:
    """
    Create and handle the lifespan of the FastAPI application, initializing
    configurations, features, and user data. It ensures proper setup before the
    server's startup and cleanup after its shutdown.

    Parameters
    ----------
    app : FastAPI
        The FastAPI application instance.

    Yields
    ------
    AsyncGenerator[None, Any]
        An asynchronous generator that manages resources for the application's lifespan.
    """

    tables: List[str] = inspect(engine).get_table_names()
    logger.debug(_("D0010002") % {"tables": tables, "number": len(tables)})
    init_configurations(session)
    init_features(app, session)
    init_users(session)

    yield


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=constants.ROUTER_PREFIX_AUTHENTICATION + constants.ROUTER_COMMON_BLANK
)
