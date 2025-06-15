from time import time
from typing import Any, Callable, Coroutine

from fastapi import Request, Response
from fastapi.routing import APIRoute

from one_public_api.core.i18n import translate as _
from one_public_api.core.log import logger


class BaseRoute(APIRoute):
    def get_route_handler(self) -> Callable[[Request], Coroutine[Any, Any, Response]]:
        base_route_handler = super().get_route_handler()

        async def handler(request: Request) -> Response:
            logger.info(_("PROCESSING_STARTED") % self.name)
            start_time = time()

            response: Response = await base_route_handler(request)

            duration_time = time() - start_time
            logger.info(_("PROCESSING_COMPLETED") % (self.name, duration_time))

            return response

        return handler
