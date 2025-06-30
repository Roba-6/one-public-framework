from fastapi import FastAPI

from one_public_api.common import constants
from one_public_api.core import initialize, lifespan
from one_public_api.core import translate as _
from one_public_api.routers import (
    authenticate_router,
    configuration_router,
    feature_router,
    user_router,
)

app = FastAPI(
    title=_("One Public API"),
    version=constants.VERSION,
    lifespan=lifespan,
    openapi_tags=[
        {
            "name": _("Configurations"),
            "description": _("configuration description"),
        },
        {
            "name": _("Users"),
            "description": _("user description"),
        },
    ],
)
initialize(app)

app.include_router(
    router=configuration_router.public_router,
    prefix=constants.ROUTER_PREFIX_CONFIGURATION,
    tags=[_("Configurations")],
)

app.include_router(
    router=configuration_router.admin_router,
    prefix=constants.ROUTER_PREFIX_CONFIGURATION,
    tags=[_("Configurations")],
)

app.include_router(
    router=feature_router.public_router,
    prefix=constants.ROUTER_PREFIX_FEATURE,
    tags=[_("Features")],
)

app.include_router(
    router=feature_router.admin_router,
    prefix=constants.ROUTER_PREFIX_FEATURE,
    tags=[_("Features")],
)


app.include_router(
    router=authenticate_router.public_router,
    prefix=constants.ROUTER_PREFIX_AUTHENTICATION,
    tags=[_("Authentications")],
)

app.include_router(
    router=authenticate_router.admin_router,
    prefix=constants.ROUTER_PREFIX_AUTHENTICATION,
    tags=[_("Authentications")],
)

app.include_router(
    router=user_router.public_router,
    prefix=constants.ROUTER_PREFIX_USER,
    tags=[_("Users")],
)

app.include_router(
    router=user_router.admin_router,
    prefix=constants.ROUTER_PREFIX_USER,
    tags=[_("Users")],
)
