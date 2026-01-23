from typing import Any, Dict, List, Optional

from sqlmodel import Field, SQLModel

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.password_mixin import PasswordMixin
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


class LoginRequest(PasswordMixin, SQLModel):
    username: str = Field(
        min_length=constants.LENGTH_3,
        max_length=constants.LENGTH_55,
        description=_("User name"),
    )
    remember_me: bool = Field(
        default=False,
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
    access_token: str = Field(description=_("Access token"))
    token_type: str = Field(default="Bearer", description=_("Token type"))

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
