from typing import Annotated

from fastapi import APIRouter, Response
from fastapi.params import Depends

from one_public_api.common import constants
from one_public_api.common.tools import create_response_data
from one_public_api.core import translate as _
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas.authenticate_schema import (
    LoginRequest,
    ProfileResponse,
    TokenResponse,
)
from one_public_api.schemas.response_schema import EmptyResponse, ResponseSchema
from one_public_api.services.authenticate_service import AuthenticateService

router = APIRouter(route_class=BaseRoute)


@router.post(
    constants.ROUTER_AUTH_SIGNUP,
    name="SYS-ATH-P-SUP",
    summary=_("Sign Up"),
    response_model=ResponseSchema[EmptyResponse],
)
def signup_api() -> ResponseSchema[EmptyResponse]:
    return create_response_data(EmptyResponse, None)


@router.post(
    constants.ROUTER_AUTH_LOGIN,
    name="SYS-ATH-P-LGN",
    summary=_("Login"),
    response_model=ResponseSchema[TokenResponse],
)
def login_api(
    aths: Annotated[AuthenticateService, Depends()],
    request: LoginRequest,
    response: Response,
) -> ResponseSchema[TokenResponse]:
    return create_response_data(TokenResponse, aths.login(request, response))


@router.get(
    constants.ROUTER_AUTH_REFRESH,
    name="SYS-ATH-P-RFS",
    summary=_("Refresh Token"),
    response_model=ResponseSchema[TokenResponse],
)
def refresh_api() -> ResponseSchema[TokenResponse]:
    return create_response_data(
        TokenResponse,
        {"access_token": "test_token", "token_type": "test_refresh_token"},
    )


@router.get(
    constants.ROUTER_AUTH_PROFILE,
    name="SYS-ATH-P-PRF",
    summary=_("Get Profile"),
    response_model=ResponseSchema[ProfileResponse],
)
def profile_api() -> ResponseSchema[ProfileResponse]:
    return create_response_data(
        ProfileResponse,
        {},
    )


@router.get(
    constants.ROUTER_AUTH_LOGOUT,
    name="SYS-ATH-P-LGO",
    summary=_("Logout"),
    response_model=ResponseSchema,
)
def logout_api() -> ResponseSchema[EmptyResponse]:
    return create_response_data(EmptyResponse, None)


#
# @router.post(
#     constants.ROUTER_AUTH_LOGIN,
#     name="SYS-ATH-P-LGN",
#     summary=_("Login"),
#     response_model=ResponseSchema[TokenResponse],
# )
# def login_form() -> ResponseSchema[TokenResponse]:
#     return create_response_data(
#         TokenResponse,
#         {"access_token": "test_token", "token_type": "test_refresh_token"},
#     )
