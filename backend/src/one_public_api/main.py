from fastapi import FastAPI

from one_public_api.common import constants
from one_public_api.core import initialize, lifespan
from one_public_api.core import translate as _
from one_public_api.core.settings import settings

app = FastAPI(
    title=settings.NAME if settings.NAME else _("API NAME"),
    version=constants.VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/ref" if settings.DEBUG else None,
    openapi_url=settings.JSON_URL,
    lifespan=lifespan,
    debug=settings.DEBUG,
)
initialize(app)
