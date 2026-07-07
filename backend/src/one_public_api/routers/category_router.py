from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Path
from fastapi.params import Depends, Query

from one_public_api.common import constants
from one_public_api.common.query_param import QueryParam
from one_public_api.common.tools import create_response_data
from one_public_api.core import translate as _
from one_public_api.models import Category
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas.category_schema import (
    CategoryCreateRequest,
    CategoryPublicResponse,
    CategoryResponse,
    CategoryUpdateRequest,
)
from one_public_api.schemas.response_schema import ResponseSchema
from one_public_api.services.authenticate_service import get_current_user
from one_public_api.services.category_service import CategoryService

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)
prefix = constants.ROUTER_PREFIX_CATEGORY
tags = [_("Categories")]


# ----- Public APIs --------------------------------------------------------------------
@public_router.get(
    constants.ROUTER_COMMON_BLANK,
    name="SYS-CAT-P-LST",
    summary=_("List Public Categories"),
    response_model=ResponseSchema[List[CategoryPublicResponse]],
)
def list_public_api(
    cats: Annotated[CategoryService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[CategoryPublicResponse]:
    return create_response_data(
        CategoryPublicResponse, cats.get_all_public(query), cats.count, cats.detail
    )


@public_router.get(
    constants.ROUTER_COMMON_WITH_ID,
    name="SYS-CAT-P-DTL",
    summary=_("Get Public Category"),
    response_model=ResponseSchema[CategoryResponse],
)
def retrieve_public_api(
    cats: Annotated[CategoryService, Depends()],
    target_id: UUID = Path(
        description=_("The ID of the category item to be retrieved")
    ),
) -> ResponseSchema[CategoryPublicResponse]:
    return create_response_data(
        CategoryPublicResponse, cats.get_one_by_id(target_id), detail=cats.detail
    )


# ----- Admin APIs ---------------------------------------------------------------------


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-CAT-A-LST",
    summary=_("List Categories"),
    response_model=ResponseSchema[List[CategoryResponse]],
)
def list_admin_api(
    cats: Annotated[CategoryService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[CategoryResponse]:
    return create_response_data(
        CategoryResponse, cats.get_all(query), cats.count, cats.detail
    )


@admin_router.post(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-CAT-A-ADD",
    summary=_("Create Category"),
    response_model=ResponseSchema[CategoryResponse],
)
def create_admin_api(
    cats: Annotated[CategoryService, Depends()],
    data: CategoryCreateRequest,
) -> ResponseSchema[CategoryPublicResponse]:
    return create_response_data(
        CategoryPublicResponse,
        cats.add_one(Category(**data.model_dump())),
        detail=cats.detail,
    )


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-CAT-A-DTL",
    summary=_("Get Category"),
    response_model=ResponseSchema[CategoryResponse],
)
def retrieve_admin_api(
    cats: Annotated[CategoryService, Depends()],
    target_id: UUID = Path(
        description=_("The ID of the category item to be retrieved")
    ),
) -> ResponseSchema[CategoryResponse]:
    return create_response_data(
        CategoryResponse, cats.get_one_by_id(target_id), detail=cats.detail
    )


@admin_router.put(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-CAT-A-UPD",
    summary=_("Update Category"),
    response_model=ResponseSchema[CategoryResponse],
)
def update_admin_api(
    cats: Annotated[CategoryService, Depends()],
    data: CategoryUpdateRequest,
    target_id: UUID = Path(description=_("The ID of the category item to be updated")),
) -> ResponseSchema[CategoryResponse]:
    return create_response_data(
        CategoryResponse,
        cats.update_one_by_id(
            target_id, Category(**data.model_dump()), nullable_keys=["category_id"]
        ),
        detail=cats.detail,
    )


@admin_router.delete(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-CAT-A-DEL",
    summary=_("Delete Category"),
    response_model=ResponseSchema[CategoryResponse],
)
def destroy_admin_api(
    cats: Annotated[CategoryService, Depends()],
    target_id: UUID = Path(description=_("The ID of the category item to be deleted")),
) -> ResponseSchema[CategoryResponse]:
    return create_response_data(
        CategoryResponse, cats.delete_one_by_id(target_id), detail=cats.detail
    )
