from sqlmodel import Field, SQLModel

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.password_mixin import PasswordMixin
from one_public_api.models.system.user_model import UserBase


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
        "json_schema_extra": {
            "examples": [
                {
                    "username": "test-user",
                    "password": "<PASSWORD>",
                }
            ],
        },
    }


class TokenResponse(SQLModel):
    access_token: str = Field(description=_("The access token."))
    token_type: str = Field(default="Bearer", description=_("The type of the token."))

    model_config = {
        "alias_generator": to_camel,
        "json_schema_extra": {
            "examples": [
                {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJh"
                    "ZG1pbiIsImV4cCI6MTc1MTE2MTY0NX0.SKtu8mzzviAtvPJaD"
                    "FIqI2-kZzHSHa_6Y-kWHgCkVBA",
                    "token_type": "Bearer",
                }
            ],
        },
    }


class ProfileResponse(UserBase):
    pass
