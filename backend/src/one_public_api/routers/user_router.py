from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Path
from fastapi.params import Depends, Query

from one_public_api.common import constants
from one_public_api.common.query_param import QueryParam
from one_public_api.common.tools import create_response_data
from one_public_api.core import translate as _
from one_public_api.models import User
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas import (
    UserCreateRequest,
    UserPublicResponse,
    UserResponse,
    UserUpdateRequest,
)
from one_public_api.schemas.response_schema import ResponseSchema
from one_public_api.services.authenticate_service import get_current_user
from one_public_api.services.user_service import UserService

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)
prefix = constants.ROUTER_PREFIX_USER
tags = [_("Users")]

# ----- Public APIs --------------------------------------------------------------------


@public_router.get(
    constants.ROUTER_COMMON_BLANK,
    name="SYS-USR-P-LST",
    summary=_("List Public Users"),
    response_model=ResponseSchema[List[UserPublicResponse]],
)
def list_public_api(
    us: Annotated[UserService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[UserPublicResponse]:
    return create_response_data(
        UserPublicResponse, us.get_all(query), us.count, us.detail
    )


@public_router.get(
    constants.ROUTER_COMMON_WITH_ID,
    name="SYS-USR-P-DTL",
    summary=_("Get Public User"),
    response_model=ResponseSchema[UserPublicResponse],
)
def retrieve_api(
    us: Annotated[UserService, Depends()],
    target_id: UUID = Path(description=_("The ID of the user to be retrieved")),
) -> ResponseSchema[UserPublicResponse]:
    return create_response_data(
        UserPublicResponse, us.get_one_by_id(target_id), detail=us.detail
    )


# ----- Admin APIs ---------------------------------------------------------------------


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-USR-A-LST",
    summary=_("List Users"),
    response_model=ResponseSchema[List[UserResponse]],
)
def list_admin_api(
    us: Annotated[UserService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[UserResponse]:
    return create_response_data(UserResponse, us.get_all(query), us.count, us.detail)


@admin_router.post(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-USR-A-ADD",
    summary=_("Create User"),
    response_model=ResponseSchema[UserResponse],
)
def create_admin_api(
    current_user: Annotated[User, Depends(get_current_user)],
    us: Annotated[UserService, Depends()],
    data: UserCreateRequest,
) -> ResponseSchema[UserResponse]:
    return create_response_data(
        UserResponse,
        us.add_user(User(**data.model_dump()), current_user),
        detail=us.detail,
    )


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-USR-A-DTL",
    summary=_("Get User"),
    response_model=ResponseSchema[UserResponse],
)
def retrieve_admin_api(
    us: Annotated[UserService, Depends()],
    target_id: UUID = Path(description=_("The ID of the user to be retrieved")),
) -> ResponseSchema[UserResponse]:
    return create_response_data(
        UserResponse, us.get_one_by_id(target_id), detail=us.detail
    )


@admin_router.put(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-USR-A-UPD",
    summary=_("Update User"),
    response_model=ResponseSchema[UserResponse],
)
def update_admin_api(
    current_user: Annotated[User, Depends(get_current_user)],
    us: Annotated[UserService, Depends()],
    data: UserUpdateRequest,
    target_id: UUID = Path(description=_("The ID of the user to be updated")),
) -> ResponseSchema[UserResponse]:
    return create_response_data(
        UserResponse,
        us.update_one_by_id_with_user(
            target_id, User(**data.model_dump()), current_user
        ),
        detail=us.detail,
    )


@admin_router.delete(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-USR-A-DEL",
    summary=_("Delete User"),
    response_model=ResponseSchema[UserResponse],
)
def destroy_admin_api(
    us: Annotated[UserService, Depends()],
    target_id: UUID = Path(
        description=_("The ID of the configuration item to be deleted")
    ),
) -> ResponseSchema[UserResponse]:
    return create_response_data(
        UserResponse, us.delete_one_by_id(target_id), detail=us.detail
    )
