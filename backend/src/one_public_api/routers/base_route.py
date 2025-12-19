from time import time
from typing import Any, Callable, Coroutine

from fastapi import HTTPException, Request, Response, status
from fastapi.routing import APIRoute

from one_public_api.common.tools import load_route_handler
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
            custom_handler = load_route_handler(
                "**/custom_route/*.py",
                "custom_route",
                "custom_handler",
            )

            response: Response
            if custom_handler:
                # When using a common router handler defined by the user.
                return await custom_handler(request, base_route_handler)
            else:
                logger.info(_("PROCESSING_STARTED") % self.name)
                start_time = time()
                try:
                    if settings.FEATURE_CONTROL:
                        await self.is_feature_enabled(request)

                    response = await base_route_handler(request)

                    return response
                except Exception:
                    raise
                finally:
                    duration_time = time() - start_time
                    logger.info(_("PROCESSING_COMPLETED") % (self.name, duration_time))

        return handler

    async def is_feature_enabled(self, request: Request) -> None:
        try:
            fs = FeatureService(session, get_language_from_request_header(request))
            feature: Feature = fs.get_one({"name": self.name})
            if not feature.is_enabled:
                raise ForbiddenError(_("Feature is disabled"), self.name, "E4030003")
        except ForbiddenError:
            raise
        except HTTPException:
            raise DataError(
                _("Feature not found."),
                self.name,
                "E4040001",
                status.HTTP_404_NOT_FOUND,
            )
