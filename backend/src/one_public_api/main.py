from fastapi import FastAPI

from one_public_api.common import constants
from one_public_api.core import initialize, lifespan
from one_public_api.core import translate as _
from one_public_api.core.extensions import load_router

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
load_router(app, constants.PATH_APP + "/**/routers/*.py")
load_router(app, "routers/*.py")
