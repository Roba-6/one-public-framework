from typing import Any, Dict, Optional

from pydantic import EmailStr, computed_field
from sqlmodel import Field

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.password_mixin import PasswordMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.user_model import UserBase, UserStatus
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "name": "user-123",
    "firstname": "Taro",
    "lastname": "Yamada",
    "fullname": "Taro Yamada",
    "nickname": "Roba",
    "email": "test@test.com",
    "password": "password123",
}

example_status: Dict[str, Any] = {
    "isDisabled": False,
    "isLocked": False,
    "loginFailedTimes": 0,
}

example_datetime: Dict[str, Any] = {
    "createdAt": "2023-01-01T00:00:00+00:00",
    "updatedAt": "2023-01-01T00:00:00+00:00",
}

example_user: Dict[str, Any] = {**example_id, **example_base, **example_datetime}


# ----- Public Schemas -----------------------------------------------------------------


class UserPublicResponse(UserBase, TimestampMixin, IdMixin):
    @computed_field(return_type=str, description=_("Full name"))
    def fullname(self) -> str:
        firstname = self.firstname if self.firstname else ""
        lastname = self.lastname if self.lastname else ""

        return f"{firstname} {lastname}".strip()

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_base, **example_datetime}],
        },
    }


# ----- Admin Schemas ------------------------------------------------------------------


class UserCreateRequest(UserBase, PasswordMixin):
    name: str = Field(
        min_length=constants.MAX_LENGTH_3,
        max_length=constants.MAX_LENGTH_55,
        description=_("User name"),
    )
    email: EmailStr = Field(
        max_length=constants.MAX_LENGTH_128,
        description=_("User's email address"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [example_base]},
    }


class UserUpdateRequest(UserBase, UserStatus):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_status}]},
    }


class UserResponse(UserBase, UserStatus, TimestampMixin, IdMixin):
    creator: Optional[UserPublicResponse] = Field(
        default=None,
        description=_("Creator"),
    )
    updater: Optional[UserPublicResponse] = Field(
        default=None,
        description=_("Updater"),
    )

    @computed_field(return_type=str, description=_("Full name"))
    def fullname(self) -> str:
        firstname = self.firstname if self.firstname else ""
        lastname = self.lastname if self.lastname else ""

        return f"{firstname} {lastname}".strip()

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {
                    "creator": example_user,
                    "updater": example_user,
                    **example_base,
                    **example_status,
                    **example_id,
                }
            ],
        },
    }
