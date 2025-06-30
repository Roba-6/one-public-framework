from typing import Any, Dict

from pydantic import computed_field
from sqlmodel import Field

from one_public_api.common.utility.str import to_camel
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.password_mixin import PasswordMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.user_model import UserBase
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

example_response: Dict[str, Any] = {
    "isDisabled": False,
    "isLocked": False,
    "loginFailedTimes": 0,
}


# ----- Public Schemas -----------------------------------------------------------------


class UserPublicResponse(UserBase, TimestampMixin, IdMixin):
    @computed_field
    def fullname(self) -> str:
        firstname = self.firstname if self.firstname else ""
        lastname = self.lastname if self.lastname else ""

        return f"{firstname} {lastname}".strip()

    model_config = {
        "alias_generator": to_camel,
        "json_schema_extra": {
            "examples": [{**example_base, **example_response, **example_id}],
        },
    }


# ----- Admin Schemas ------------------------------------------------------------------


class UserCreateRequest(UserBase, PasswordMixin):
    is_disabled: bool | None = Field(exclude=True)
    is_locked: bool | None = Field(exclude=True)
    login_failed_times: int = Field(exclude=True)

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [example_base]},
    }


class UserUpdateRequest(UserBase):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [example_base]},
    }


class UserResponse(UserPublicResponse):
    model_config = {
        "alias_generator": to_camel,
        "json_schema_extra": {
            "examples": [{**example_base, **example_response, **example_id}],
        },
    }
