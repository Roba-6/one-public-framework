from typing import Any, Dict, List, Optional

from pydantic import Field
from sqlmodel import SQLModel

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.password_mixin import (
    HASHED_PASSWORD_FIELD_KWARGS,
    PasswordMixin,
)
from one_public_api.models.system.user_model import USER_USERNAME_FIELD_KWARGS
from one_public_api.schemas import (
    ConfigurationPublicResponse,
    UserPublicResponse,
    example_datetime,
    example_user_base,
)
from one_public_api.schemas.response_schema import example_id
from one_public_api.schemas.role_schema import RolePublicResponse

example_base: Dict[str, Any] = {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIs"
    "ImV4cCI6MTc1MTE2MTY0NX0.SKtu8mzzviAtvPJaDFIqI2-kZzHSHa_6Y-kWHgCkVBA",
    "token_type": "Bearer",
}


class LoginRequest(PasswordMixin):
    username: str = Field(
        min_length=constants.LENGTH_3,
        **USER_USERNAME_FIELD_KWARGS,
    )
    password: str = Field(
        pattern=r"^[\x21-\x7E]+$",
        **HASHED_PASSWORD_FIELD_KWARGS,
    )
    remember_me: bool = Field(
        default=False,
        title=_("Remember me"),
        description=_(
            "A Boolean flag indicating whether the user should be remembered."
        ),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {
                    "username": "test-user",
                    "password": "<PASSWORD>",
                }
            ],
        },
    }


class LoginFormResponse(SQLModel):
    access_token: str = Field(
        title=_("Access Token"), description=_("Access Token Description")
    )
    token_type: str = Field(
        default="Bearer", title=_("Token Type"), description=_("Token Type Description")
    )

    model_config = {
        "json_schema_extra": {
            "examples": [{**example_base}],
        },
    }


class TokenResponse(LoginFormResponse):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_base}],
        },
    }


class ProfileResponse(UserPublicResponse):
    role: Optional[RolePublicResponse] = Field(
        default=None,
        title=_("Role"),
        description=_("Role Description"),
    )
    configurations: List[ConfigurationPublicResponse] = Field(
        title=_("Configuration"),
        description=_("Configuration Description"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_user_base, **example_datetime}],
        },
    }
