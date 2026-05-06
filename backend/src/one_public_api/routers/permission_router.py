from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Path
from fastapi.params import Depends, Query

from one_public_api.common import constants
from one_public_api.common.query_param import QueryParam
from one_public_api.common.tools import create_response_data
from one_public_api.core import translate as _
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas.permission_schema import (
    PermissionCreateRequest,
    PermissionPublicResponse,
    PermissionResponse,
    PermissionUpdateRequest,
)
from one_public_api.schemas.response_schema import ResponseSchema
from one_public_api.services.authenticate_service import get_current_user
from one_public_api.services.permission_service import PermissionService

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)
prefix = constants.ROUTER_PREFIX_PERMISSION
tags = [_("Permissions")]

# ----- Public APIs --------------------------------------------------------------------


@public_router.get(
    constants.ROUTER_COMMON_BLANK,
    name="SYS-PRM-P-LST",
    summary=_("List Public Permissions"),
    response_model=ResponseSchema[List[PermissionPublicResponse]],
)
def list_public_api(
    ps: Annotated[PermissionService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[PermissionPublicResponse]:
    return create_response_data(
        PermissionPublicResponse, ps.get_all(query), ps.count, ps.detail
    )


# ----- Admin APIs ---------------------------------------------------------------------


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-PRM-A-LST",
    summary=_("List Permissions"),
    response_model=ResponseSchema[List[PermissionResponse]],
)
def list_admin_api(
    ps: Annotated[PermissionService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[PermissionResponse]:
    return create_response_data(
        PermissionResponse, ps.get_all(query), ps.count, ps.detail
    )


@admin_router.post(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-PRM-A-ADD",
    summary=_("Create Permission"),
    response_model=ResponseSchema[PermissionResponse],
)
def create_admin_api(
    ps: Annotated[PermissionService, Depends()],
    data: PermissionCreateRequest,
) -> ResponseSchema[PermissionResponse]:
    return create_response_data(
        PermissionResponse,
        ps.add_one(data),
        detail=ps.detail,
    )


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-PRM-A-DTL",
    summary=_("Get Permission"),
    response_model=ResponseSchema[PermissionResponse],
)
def retrieve_admin_api(
    ps: Annotated[PermissionService, Depends()],
    target_id: UUID = Path(
        description=_("The ID of the permission item to be retrieved")
    ),
) -> ResponseSchema[PermissionResponse]:
    return create_response_data(
        PermissionResponse, ps.get_one_by_id(target_id), detail=ps.detail
    )


@admin_router.put(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-PRM-A-UPD",
    summary=_("Update Permission"),
    response_model=ResponseSchema[PermissionResponse],
)
def update_admin_api(
    ps: Annotated[PermissionService, Depends()],
    data: PermissionUpdateRequest,
    target_id: UUID = Path(
        description=_("The ID of the permission item to be updated")
    ),
) -> ResponseSchema[PermissionResponse]:
    return create_response_data(
        PermissionResponse,
        ps.update_one_by_id(target_id, data),
        detail=ps.detail,
    )


@admin_router.delete(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-PRM-A-DEL",
    summary=_("Delete Permission"),
    response_model=ResponseSchema[PermissionResponse],
)
def destroy_admin_api(
    ps: Annotated[PermissionService, Depends()],
    target_id: UUID = Path(
        description=_("The ID of the permission item to be deleted")
    ),
) -> ResponseSchema[PermissionResponse]:
    return create_response_data(
        PermissionResponse, ps.delete_one_by_id(target_id), detail=ps.detail
    )
