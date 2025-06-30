from time import time
from typing import Any, Callable, Coroutine

from fastapi import HTTPException, Request, Response, status
from fastapi.routing import APIRoute

from one_public_api.core.database import session
from one_public_api.core.exceptions import DataError, ForbiddenError
from one_public_api.core.i18n import get_language_from_request_header
from one_public_api.core.i18n import translate as _
from one_public_api.core.log import logger
from one_public_api.core.settings import settings
from one_public_api.models import Feature
from one_public_api.services.feture_service import FeatureService


class BaseRoute(APIRoute):
    def get_route_handler(self) -> Callable[[Request], Coroutine[Any, Any, Response]]:
        base_route_handler = super().get_route_handler()

        async def handler(request: Request) -> Response:
            logger.info(_("PROCESSING_STARTED") % self.name)
            start_time = time()

            if settings.FEATURE_CONTROL:
                await self.is_feature_enabled(request)

            response: Response = await base_route_handler(request)

            duration_time = time() - start_time
            logger.info(_("PROCESSING_COMPLETED") % (self.name, duration_time))

            return response

        return handler

    async def is_feature_enabled(self, request: Request) -> None:
        try:
            fs = FeatureService(session, get_language_from_request_header(request))
            feature: Feature = fs.get_one({"name": self.name})
            if not feature.is_enabled:
                raise ForbiddenError(_("Feature is disabled"), self.name, "E40300003")
        except ForbiddenError:
            raise
        except HTTPException:
            raise DataError(
                _("Feature not found."),
                self.name,
                "E40400001",
                status.HTTP_404_NOT_FOUND,
            )
