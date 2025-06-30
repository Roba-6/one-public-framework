from typing import Any, Dict

from sqlmodel import Field, SQLModel

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.password_mixin import PasswordMixin
from one_public_api.models.system.user_model import UserBase

example_base: Dict[str, Any] = {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIs"
    "ImV4cCI6MTc1MTE2MTY0NX0.SKtu8mzzviAtvPJaDFIqI2-kZzHSHa_6Y-kWHgCkVBA",
    "token_type": "Bearer",
}


class LoginRequest(PasswordMixin, SQLModel):
    username: str = Field(
        min_length=constants.MAX_LENGTH_3,
        max_length=constants.MAX_LENGTH_55,
        description=_("The name of the user."),
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
    access_token: str = Field(description=_("The access token."))
    token_type: str = Field(default="Bearer", description=_("The type of the token."))

    model_config = {
        "json_schema_extra": {
            "examples": [{**example_base}],
        },
    }


class TokenResponse(LoginFormResponse):
    model_config = {
        "alias_generator": to_camel,
        "json_schema_extra": {
            "examples": [{**example_base}],
        },
    }


class ProfileResponse(UserBase):
    is_disabled: bool | None = Field(exclude=True)
    is_locked: bool | None = Field(exclude=True)
    login_failed_times: int = Field(exclude=True)
