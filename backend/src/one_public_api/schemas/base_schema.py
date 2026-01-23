from typing import Any, Dict, List, Optional

from pydantic import EmailStr, computed_field
from sqlmodel import Field

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.password_mixin import PasswordMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.configuration_model import (
    ConfigurationBase,
    ConfigurationOption,
    ConfigurationType,
)
from one_public_api.models.system.user_model import UserBase, UserStatus
from one_public_api.schemas.organization_schema import OrganizationPublicResponse
from one_public_api.schemas.organization_schema import (
    example_base as organization_example,
)
from one_public_api.schemas.response_schema import example_audit, example_id
from one_public_api.schemas.role_schema import RolePublicResponse
from one_public_api.schemas.role_schema import (
    example_base as role_example,
)

# ===== User Schemas ===================================================================

example_user_base: Dict[str, Any] = {
    "name": "user-123",
    "firstname": "Taro",
    "lastname": "Yamada",
    "nickname": "Roba",
    "email": "test@test.com",
    "password": "password123",
    "configuration": [],
    "organization": organization_example,
    "role": role_example,
}

example_fullname: Dict[str, Any] = {
    "fullname": "Taro Yamada",
}

example_user_status: Dict[str, Any] = {
    "isDisabled": False,
    "isLocked": False,
    "failedAttempts": 0,
}

example_datetime: Dict[str, Any] = {
    "createdAt": "2023-01-01T00:00:00+00:00",
    "updatedAt": "2023-01-01T00:00:00+00:00",
}

example_user: Dict[str, Any] = {**example_id, **example_user_base, **example_datetime}


# ----- User Public Schemas ------------------------------------------------------------


class UserPublicResponse(UserBase, TimestampMixin, IdMixin):
    organization: Optional[OrganizationPublicResponse] = Field(
        default=None,
        description=_("Organization"),
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
                    **example_id,
                    **example_fullname,
                    **example_user_base,
                    **example_datetime,
                }
            ],
        },
    }


# ----- User Admin Schemas -------------------------------------------------------------


class UserCreateRequest(UserBase, PasswordMixin):
    name: str = Field(
        min_length=constants.LENGTH_3,
        max_length=constants.LENGTH_55,
        description=_("User name"),
    )
    email: EmailStr = Field(
        max_length=constants.LENGTH_128,
        description=_("User's email address"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [example_user_base]},
    }


class UserUpdateRequest(UserBase, UserStatus):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_user_base, **example_user_status}]
        },
    }


class UserResponse(UserPublicResponse, UserStatus):
    creator: Optional[UserPublicResponse] = Field(
        default=None,
        description=_("Creator"),
    )
    updater: Optional[UserPublicResponse] = Field(
        default=None,
        description=_("Updater"),
    )
    organization: Optional[OrganizationPublicResponse] = Field(
        default=None,
        description=_("Organization"),
    )
    roles: Optional[List[RolePublicResponse]] = Field(
        default=None,
        description=_("Role"),
    )
    configurations: Optional[List["ConfigurationPublicResponse"]] = Field(
        default=None,
        description=_("Configuration"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {
                    "creator": example_user,
                    "updater": example_user,
                    **example_user_base,
                    **example_fullname,
                    **example_user_status,
                    **example_id,
                }
            ],
        },
    }


# ----- User Common Schemas ------------------------------------------------------------


class UserReferenceResponse:
    creator: Optional[UserPublicResponse] = Field(
        default=None,
        title=_("Creator"),
        description=_("Creator Description"),
    )
    updater: Optional[UserPublicResponse] = Field(
        default=None,
        title=_("Updater"),
        description=_("Updater Description"),
    )


# ===== Configuration Schemas ==========================================================


example_configuration_base: Dict[str, Any] = {
    "name": "Time Zone",
    "key": "time_zone",
    "value": "America/New_York",
    "type": 1,
    "description": "The time zone in which the application is running.",
}
example_configuration_options: Dict[str, Any] = {
    "options": {
        "type": "select",
        "values": [
            {"name": "America/New York", "value": "America/New_York"},
            {"name": "Asia/Tokyo", "value": "Asia/Tokyo"},
        ],
    },
}


# ----- Configuration Public Schemas ---------------------------------------------------


class ConfigurationPublicResponse(ConfigurationBase, IdMixin):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_configuration_base}],
        },
    }


# ----- Configuration Admin Schemas ----------------------------------------------------


class ConfigurationCreateRequest(ConfigurationBase, ConfigurationOption):
    key: str = Field(
        min_length=constants.LENGTH_3,
        max_length=constants.LENGTH_100,
        description=_("Configuration key"),
    )
    value: str = Field(
        max_length=constants.LENGTH_500,
        description=_("Configuration value"),
    )
    type: ConfigurationType = Field(
        description=_("Configuration type"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {**example_configuration_base, **example_configuration_options}
            ]
        },
    }


class ConfigurationUpdateRequest(ConfigurationBase, ConfigurationOption):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {**example_configuration_base, **example_configuration_options}
            ]
        },
    }


class ConfigurationResponse(
    ConfigurationPublicResponse,
    ConfigurationOption,
    TimestampMixin,
    UserReferenceResponse,
):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {
                    "creator": example_user,
                    "updater": example_user,
                    **example_configuration_base,
                    **example_configuration_options,
                    **example_audit,
                    **example_id,
                }
            ],
        },
    }
