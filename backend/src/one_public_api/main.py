from fastapi import FastAPI

from one_public_api.common import constants
from one_public_api.core import initialize, lifespan
from one_public_api.core import translate as _
from one_public_api.core.settings import settings

app = FastAPI(
    title=settings.TITLE if settings.TITLE else _("API TITLE"),
    version=constants.VERSION,
    lifespan=lifespan,
    debug=settings.DEBUG,
)
initialize(app)
