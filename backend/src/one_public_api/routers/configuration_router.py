from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Path
from fastapi.params import Depends, Query

from one_public_api.common import constants
from one_public_api.common.query_param import QueryParam
from one_public_api.common.tools import create_response_data
from one_public_api.core import translate as _
from one_public_api.models import Configuration, User
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas import (
    ConfigurationCreateRequest,
    ConfigurationPublicResponse,
    ConfigurationResponse,
    ConfigurationUpdateRequest,
)
from one_public_api.schemas.response_schema import ResponseSchema
from one_public_api.services.authenticate_service import get_current_user
from one_public_api.services.configuration_service import ConfigurationService

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)
prefix = constants.ROUTER_PREFIX_CONFIGURATION
tags = [_("Configurations")]

# ----- Public APIs --------------------------------------------------------------------


@public_router.get(
    constants.ROUTER_COMMON_BLANK,
    name="SYS-COF-P-LST",
    summary=_("List Public Configurations"),
    response_model=ResponseSchema[List[ConfigurationPublicResponse]],
)
def list_public_api(
    cs: Annotated[ConfigurationService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[ConfigurationPublicResponse]:
    """
    **SYS-COF-P-LST** List Public Configurations.

    This endpoint retrieves a list of public configurations based on the specified
    query parameters. The configurations are fetched using the specified
    ConfigurationService instance.

    Parameters
    ----------
    cs : ConfigurationService
        The service instance used to fetch and manage configuration data.

    query : QueryParam
        Query parameters used to filter the list of public configurations.

    Returns
    -------
    ResponseSchema[ConfigurationPublicResponse]
        A response schema containing the list of public configurations, along with
        metadata such as count and detail information.
    """

    return create_response_data(
        ConfigurationPublicResponse, cs.get_all(query), cs.count, cs.detail
    )


# ----- Admin APIs ---------------------------------------------------------------------


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-COF-A-LST",
    summary=_("List Configurations"),
    response_model=ResponseSchema[List[ConfigurationResponse]],
)
def list_admin_api(
    cs: Annotated[ConfigurationService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[ConfigurationResponse]:
    return create_response_data(
        ConfigurationResponse, cs.get_all(query), cs.count, cs.detail
    )


@admin_router.post(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-COF-A-ADD",
    summary=_("Create Configuration"),
    response_model=ResponseSchema[ConfigurationResponse],
)
def create_admin_api(
    current_user: Annotated[User, Depends(get_current_user)],
    cs: Annotated[ConfigurationService, Depends()],
    data: ConfigurationCreateRequest,
) -> ResponseSchema[ConfigurationResponse]:
    return create_response_data(
        ConfigurationResponse,
        cs.add_one_with_user(Configuration(**data.model_dump()), current_user),
        detail=cs.detail,
    )


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-COF-A-DTL",
    summary=_("Get Configuration"),
    response_model=ResponseSchema[ConfigurationResponse],
)
def retrieve_admin_api(
    cs: Annotated[ConfigurationService, Depends()],
    target_id: UUID = Path(
        description=_("The ID of the configuration item to be retrieved")
    ),
) -> ResponseSchema[ConfigurationResponse]:
    return create_response_data(
        ConfigurationResponse, cs.get_one_by_id(target_id), detail=cs.detail
    )


@admin_router.put(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-COF-A-UPD",
    summary=_("Update Configuration"),
    response_model=ResponseSchema[ConfigurationResponse],
)
def update_admin_api(
    current_user: Annotated[User, Depends(get_current_user)],
    cs: Annotated[ConfigurationService, Depends()],
    data: ConfigurationUpdateRequest,
    target_id: UUID = Path(
        description=_("The ID of the configuration item to be updated")
    ),
) -> ResponseSchema[ConfigurationResponse]:
    return create_response_data(
        ConfigurationResponse,
        cs.update_one_by_id_with_user(
            target_id, Configuration(**data.model_dump()), current_user
        ),
        detail=cs.detail,
    )


@admin_router.delete(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-COF-A-DEL",
    summary=_("Delete Configuration"),
    response_model=ResponseSchema[ConfigurationResponse],
)
def destroy_admin_api(
    cs: Annotated[ConfigurationService, Depends()],
    target_id: UUID = Path(
        description=_("The ID of the configuration item to be deleted")
    ),
) -> ResponseSchema[ConfigurationResponse]:
    return create_response_data(
        ConfigurationResponse, cs.delete_one_by_id(target_id), detail=cs.detail
    )
