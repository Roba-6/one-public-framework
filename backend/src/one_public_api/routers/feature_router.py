from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Path
from fastapi.params import Depends, Query

from one_public_api.common import constants
from one_public_api.common.query_param import QueryParam
from one_public_api.common.tools import create_response_data
from one_public_api.core import translate as _
from one_public_api.models import Feature
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas.feature_schema import (
    FeatureCreateRequest,
    FeaturePublicResponse,
    FeatureResponse,
    FeatureUpdateRequest,
)
from one_public_api.schemas.response_schema import ResponseSchema
from one_public_api.services.authenticate_service import get_current_user
from one_public_api.services.feture_service import FeatureService

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)
prefix = constants.ROUTER_PREFIX_FEATURE
tags = [_("Features")]

# ----- Public APIs --------------------------------------------------------------------


@public_router.get(
    constants.ROUTER_COMMON_BLANK,
    name="SYS-FTR-P-LST",
    summary=_("List Public Features"),
    response_model=ResponseSchema[List[FeaturePublicResponse]],
)
def list_public_api(
    fs: Annotated[FeatureService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[FeaturePublicResponse]:
    return create_response_data(
        FeaturePublicResponse, fs.get_all_public(query), fs.count, fs.detail
    )


# ----- Admin APIs ---------------------------------------------------------------------


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-FTR-A-LST",
    summary=_("List Features"),
    response_model=ResponseSchema[List[FeatureResponse]],
)
def list_admin_api(
    fs: Annotated[FeatureService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[FeatureResponse]:
    return create_response_data(FeatureResponse, fs.get_all(query), fs.count, fs.detail)


@admin_router.post(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-FTR-A-ADD",
    summary=_("Create Feature"),
    response_model=ResponseSchema[FeatureResponse],
)
def create_admin_api(
    fs: Annotated[FeatureService, Depends()],
    data: FeatureCreateRequest,
) -> ResponseSchema[FeatureResponse]:
    return create_response_data(
        FeatureResponse, fs.add_one(Feature(**data.model_dump())), detail=fs.detail
    )


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-FTR-A-DTL",
    summary=_("Get Feature"),
    response_model=ResponseSchema[FeatureResponse],
)
def retrieve_admin_api(
    fs: Annotated[FeatureService, Depends()],
    target_id: UUID = Path(description=_("The ID of the feature item to be retrieved")),
) -> ResponseSchema[FeatureResponse]:
    return create_response_data(
        FeatureResponse, fs.get_one_by_id(target_id), detail=fs.detail
    )


@admin_router.put(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-FTR-A-UPD",
    summary=_("Update Feature"),
    response_model=ResponseSchema[FeatureResponse],
)
def update_admin_api(
    fs: Annotated[FeatureService, Depends()],
    data: FeatureUpdateRequest,
    target_id: UUID = Path(description=_("The ID of the feature item to be updated")),
) -> ResponseSchema[FeatureResponse]:
    return create_response_data(
        FeatureResponse,
        fs.update_one_by_id(target_id, Feature(**data.model_dump())),
        detail=fs.detail,
    )


@admin_router.delete(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-FTR-A-DEL",
    summary=_("Delete Feature"),
    response_model=ResponseSchema[FeatureResponse],
)
def destroy_admin_api(
    fs: Annotated[FeatureService, Depends()],
    target_id: UUID = Path(description=_("The ID of the feature item to be deleted")),
) -> ResponseSchema[FeatureResponse]:
    return create_response_data(
        FeatureResponse, fs.delete_one_by_id(target_id), detail=fs.detail
    )
