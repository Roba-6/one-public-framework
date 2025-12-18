from typing import Annotated

from fastapi import APIRouter, Cookie, Response
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm

from one_public_api.common import constants
from one_public_api.common.tools import create_response_data
from one_public_api.core import translate as _
from one_public_api.models import User
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas import UserCreateRequest
from one_public_api.schemas.authenticate_schema import (
    LoginFormResponse,
    LoginRequest,
    ProfileResponse,
    TokenResponse,
)
from one_public_api.schemas.response_schema import EmptyResponse, ResponseSchema
from one_public_api.services.authenticate_service import (
    AuthenticateService,
    get_current_user,
)
from one_public_api.services.user_service import UserService

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)
prefix = constants.ROUTER_PREFIX_AUTHENTICATION
tags = [_("Authentications")]


# ----- Public APIs --------------------------------------------------------------------


@public_router.post(
    constants.ROUTER_AUTH_SIGNUP,
    name="SYS-ATH-P-SUP",
    summary=_("Sign Up"),
    description=_("Sign Up Description"),
    response_model=ResponseSchema[EmptyResponse],
)
def signup_api(
    us: Annotated[UserService, Depends()],
    data: UserCreateRequest,
) -> ResponseSchema[EmptyResponse]:
    us.add_one(User(**data.model_dump()))

    return create_response_data(EmptyResponse)


@public_router.post(
    constants.ROUTER_AUTH_LOGIN,
    name="SYS-ATH-P-LGN",
    summary=_("Login"),
    description=_("Login Description"),
    response_model=TokenResponse,
)
def login_api(
    aths: Annotated[AuthenticateService, Depends()],
    request: LoginRequest,
    response: Response,
) -> TokenResponse:
    return TokenResponse(**aths.login(request, response))


@public_router.get(
    constants.ROUTER_AUTH_REFRESH,
    name="SYS-ATH-P-RFS",
    summary=_("Refresh Token"),
    description=_("Refresh Token Description"),
    response_model=TokenResponse,
)
def refresh_api(
    aths: Annotated[AuthenticateService, Depends()],
    refresh_token: str = Cookie(None, description=_("Refresh token")),
) -> TokenResponse:
    return TokenResponse(**aths.refresh(refresh_token))


@public_router.get(
    constants.ROUTER_AUTH_FORCE_LOGOUT,
    name="SYS-ATH-P-FLT",
    summary=_("Force Logout"),
    description=_("Force Logout Description"),
    response_model=ResponseSchema[EmptyResponse],
)
def force_logout_api(
    aths: Annotated[AuthenticateService, Depends()],
    response: Response,
) -> ResponseSchema[EmptyResponse]:
    aths.logout(response)

    return create_response_data(EmptyResponse)


@public_router.post(
    constants.ROUTER_COMMON_BLANK,
    name="SYS-ATH-P-LGF",
    summary=_("Login Form"),
    description=_("Login Form Description"),
    response_model=LoginFormResponse,
)
def login_form(
    aths: Annotated[AuthenticateService, Depends()],
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
) -> LoginFormResponse:
    return LoginFormResponse(**aths.login(form_data, response))


# ----- Admin APIs ---------------------------------------------------------------------


@admin_router.get(
    constants.ROUTER_AUTH_PROFILE,
    name="SYS-ATH-A-PRF",
    summary=_("Get Profile"),
    description=_("Get Profile Description"),
    response_model=ResponseSchema[ProfileResponse],
)
def profile_api(
    current_user: Annotated[User, Depends(get_current_user)],
) -> ResponseSchema[ProfileResponse]:
    return create_response_data(ProfileResponse, current_user)


@admin_router.get(
    constants.ROUTER_AUTH_LOGOUT,
    name="SYS-ATH-A-LGT",
    summary=_("Logout"),
    description=_("Logout Description"),
    response_model=ResponseSchema[EmptyResponse],
)
def logout_api(
    current_user: Annotated[User, Depends(get_current_user)],
    aths: Annotated[AuthenticateService, Depends()],
    response: Response,
) -> ResponseSchema[EmptyResponse]:
    aths.logout(response, current_user)

    return create_response_data(EmptyResponse)
