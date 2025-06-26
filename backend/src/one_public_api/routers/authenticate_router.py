from typing import Annotated

from fastapi import APIRouter, Response
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm

from one_public_api.common import constants
from one_public_api.common.tools import create_response_data, get_current_user
from one_public_api.core import translate as _
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas.authenticate_schema import (
    LoginFormResponse,
    LoginRequest,
    ProfileResponse,
    TokenResponse,
)
from one_public_api.schemas.response_schema import EmptyResponse, ResponseSchema
from one_public_api.services.authenticate_service import AuthenticateService

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)


@public_router.post(
    constants.ROUTER_AUTH_SIGNUP,
    name="SYS-ATH-P-SUP",
    summary=_("Sign Up"),
    response_model=ResponseSchema[EmptyResponse],
)
def signup_api() -> ResponseSchema[EmptyResponse]:
    return create_response_data(EmptyResponse, None)


@public_router.post(
    constants.ROUTER_AUTH_LOGIN,
    name="SYS-ATH-P-LGN",
    summary=_("Login"),
    response_model=TokenResponse,
)
def login_api(
    aths: Annotated[AuthenticateService, Depends()],
    request: LoginRequest,
    response: Response,
) -> TokenResponse:
    return TokenResponse(**aths.login(request, response))


@admin_router.get(
    constants.ROUTER_AUTH_REFRESH,
    name="SYS-ATH-A-RFS",
    summary=_("Refresh Token"),
    response_model=ResponseSchema[TokenResponse],
)
def refresh_api() -> ResponseSchema[TokenResponse]:
    return create_response_data(
        TokenResponse,
        {"access_token": "test_token", "token_type": "test_refresh_token"},
    )


@admin_router.get(
    constants.ROUTER_AUTH_PROFILE,
    name="SYS-ATH-A-PRF",
    summary=_("Get Profile"),
    response_model=ResponseSchema[ProfileResponse],
)
def profile_api() -> ResponseSchema[ProfileResponse]:
    return create_response_data(
        ProfileResponse,
        {},
    )


@admin_router.get(
    constants.ROUTER_AUTH_LOGOUT,
    name="SYS-ATH-A-LGO",
    summary=_("Logout"),
    response_model=ResponseSchema,
)
def logout_api() -> ResponseSchema[EmptyResponse]:
    return create_response_data(EmptyResponse, None)


#
@public_router.post(
    constants.ROUTER_COMMON_BLANK,
    name="SYS-ATH-P-LGN",
    summary=_("Login Form"),
    response_model=LoginFormResponse,
)
def login_form(
    aths: Annotated[AuthenticateService, Depends()],
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
) -> LoginFormResponse:
    return LoginFormResponse(**aths.login(form_data, response))
