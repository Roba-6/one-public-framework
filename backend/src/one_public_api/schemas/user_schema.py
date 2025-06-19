from typing import Any, Dict

from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.password_mixin import PasswordMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.user_model import UserBase

example_base: Dict[str, Any] = {
    "name": "user-123",
    "firstname": "Taro",
    "lastname": "Yamada",
    "fullname": "Taro Yamada",
    "nickname": "Roba",
    "email": "test@test.com",
    "password": "password123",
    "is_disabled": False,
    "is_locked": False,
    "login_failed_times": 0,
}

example_id: Dict[str, Any] = {"id": "t83eb523-0a9e-4136-9602-f16a35c9525a"}


# ----- Public Schemas -----------------------------------------------------------------


class UserPublicResponse(UserBase, TimestampMixin, IdMixin):
    model_config = {
        "json_schema_extra": {
            "examples": [{**example_base, **example_id}],
        },
    }


# ----- Admin Schemas ------------------------------------------------------------------


class UserCreateRequest(UserBase, PasswordMixin):
    model_config = {
        "json_schema_extra": {"examples": [example_base]},
    }


class UserUpdateRequest(UserBase):
    model_config = {
        "json_schema_extra": {"examples": [example_base]},
    }


class UserResponse(UserBase, TimestampMixin, IdMixin):
    model_config = {
        "json_schema_extra": {
            "examples": [{**example_base, **example_id}],
        },
    }
