from fastapi import APIRouter
from fastapi.params import Depends

from one_public_api.common import constants
from one_public_api.core import translate as _
from one_public_api.routers.base_route import BaseRoute
from one_public_api.services.authenticate_service import get_current_user

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)
prefix = constants.ROUTER_PREFIX_PERMISSION
tags = [_("Permissions")]

# ----- Public APIs --------------------------------------------------------------------

# ----- Admin APIs ---------------------------------------------------------------------
