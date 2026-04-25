from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Path
from fastapi.params import Depends, Query

from one_public_api.common import constants
from one_public_api.common.query_param import QueryParam
from one_public_api.common.tools import create_response_data
from one_public_api.core import translate as _
from one_public_api.models import Action
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas.action_schema import (
    ActionCreateRequest,
    ActionPublicResponse,
    ActionResponse,
    ActionUpdateRequest,
)
from one_public_api.schemas.response_schema import ResponseSchema
from one_public_api.services.action_service import ActionService
from one_public_api.services.authenticate_service import get_current_user

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)
prefix = constants.ROUTER_PREFIX_ACTION
tags = [_("Actions")]

# ----- Public APIs --------------------------------------------------------------------


@public_router.get(
    constants.ROUTER_COMMON_BLANK,
    name="SYS-ACT-P-LST",
    summary=_("List Public Actions"),
    response_model=ResponseSchema[List[ActionPublicResponse]],
)
def list_public_api(
    acts: Annotated[ActionService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[ActionPublicResponse]:
    return create_response_data(
        ActionPublicResponse, acts.get_all_public(query), acts.count, acts.detail
    )


# ----- Admin APIs ---------------------------------------------------------------------


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-ACT-A-LST",
    summary=_("List Actions"),
    response_model=ResponseSchema[List[ActionResponse]],
)
def list_admin_api(
    acts: Annotated[ActionService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[ActionResponse]:
    return create_response_data(
        ActionResponse, acts.get_all(query), acts.count, acts.detail
    )


@admin_router.post(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-ACT-A-ADD",
    summary=_("Create Action"),
    response_model=ResponseSchema[ActionResponse],
)
def create_admin_api(
    acts: Annotated[ActionService, Depends()],
    data: ActionCreateRequest,
) -> ResponseSchema[ActionResponse]:
    return create_response_data(
        ActionResponse, acts.add_one(Action(**data.model_dump())), detail=acts.detail
    )


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-ACT-A-DTL",
    summary=_("Get Action"),
    response_model=ResponseSchema[ActionResponse],
)
def retrieve_admin_api(
    acts: Annotated[ActionService, Depends()],
    target_id: UUID = Path(description=_("The ID of the action item to be retrieved")),
) -> ResponseSchema[ActionResponse]:
    return create_response_data(
        ActionResponse, acts.get_one_by_id(target_id), detail=acts.detail
    )


@admin_router.put(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-ACT-A-UPD",
    summary=_("Update Action"),
    response_model=ResponseSchema[ActionResponse],
)
def update_admin_api(
    acts: Annotated[ActionService, Depends()],
    data: ActionUpdateRequest,
    target_id: UUID = Path(description=_("The ID of the action item to be updated")),
) -> ResponseSchema[ActionResponse]:
    return create_response_data(
        ActionResponse,
        acts.update_one_by_id(target_id, Action(**data.model_dump())),
        detail=acts.detail,
    )


@admin_router.delete(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-ACT-A-DEL",
    summary=_("Delete Action"),
    response_model=ResponseSchema[ActionResponse],
)
def destroy_admin_api(
    acts: Annotated[ActionService, Depends()],
    target_id: UUID = Path(description=_("The ID of the action item to be deleted")),
) -> ResponseSchema[ActionResponse]:
    return create_response_data(
        ActionResponse, acts.delete_one_by_id(target_id), detail=acts.detail
    )
