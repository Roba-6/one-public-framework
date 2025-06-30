from typing import Annotated

from fastapi import APIRouter
from fastapi.params import Depends, Query

from one_public_api.common import constants
from one_public_api.common.query_param import QueryParam
from one_public_api.common.tools import create_response_data
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas.feature_schema import FeaturePublicResponse
from one_public_api.schemas.response_schema import ResponseSchema
from one_public_api.services.authenticate_service import get_current_user
from one_public_api.services.feture_service import FeatureService

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)

# ----- Public APIs --------------------------------------------------------------------


@public_router.get(
    constants.ROUTER_COMMON_BLANK,
    name="SYS-FTR-P-LST",
    summary="List Public Features",
    response_model=ResponseSchema[FeaturePublicResponse],
)
def list_public_api(
    fs: Annotated[FeatureService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[FeaturePublicResponse]:
    return create_response_data(
        FeaturePublicResponse, fs.get_all(query), fs.count, fs.detail
    )


# ----- Admin APIs ---------------------------------------------------------------------
