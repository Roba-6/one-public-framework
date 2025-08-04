from typing import Any, Dict, Optional

from sqlmodel import Field

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.configuration_model import (
    ConfigurationBase,
    ConfigurationOption,
    ConfigurationType,
)
from one_public_api.schemas.response_schema import example_audit, example_id
from one_public_api.schemas.user_schema import UserPublicResponse, example_user

example_base: Dict[str, Any] = {
    "name": "Time Zone",
    "key": "time_zone",
    "value": "America/New_York",
    "type": 1,
    "description": "The time zone in which the application is running.",
}
example_options: Dict[str, Any] = {
    "options": {
        "type": "select",
        "values": [
            {"name": "America/New York", "value": "America/New_York"},
            {"name": "Asia/Tokyo", "value": "Asia/Tokyo"},
        ],
    },
}


# ----- Public Schemas -----------------------------------------------------------------


class ConfigurationPublicResponse(ConfigurationBase, IdMixin):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_base}],
        },
    }


# ----- Admin Schemas ------------------------------------------------------------------


class ConfigurationCreateRequest(ConfigurationBase, ConfigurationOption):
    key: str = Field(
        min_length=constants.MAX_LENGTH_3,
        max_length=constants.MAX_LENGTH_100,
        description=_("Configuration key"),
    )
    value: str = Field(
        max_length=constants.MAX_LENGTH_500,
        description=_("Configuration value"),
    )
    type: ConfigurationType = Field(
        description=_("Configuration type"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_options}]},
    }


class ConfigurationUpdateRequest(ConfigurationBase, ConfigurationOption):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_options}]},
    }


class ConfigurationResponse(
    ConfigurationPublicResponse, ConfigurationOption, TimestampMixin
):
    user: Optional[UserPublicResponse] = Field(
        default=None,
        description=_("User"),
    )
    creator: Optional[UserPublicResponse] = Field(
        default=None,
        description=_("Creator"),
    )
    updater: Optional[UserPublicResponse] = Field(
        default=None,
        description=_("Updater"),
    )
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {
                    "user": example_user,
                    "creator": example_user,
                    "updater": example_user,
                    **example_base,
                    **example_options,
                    **example_audit,
                    **example_id,
                }
            ],
        },
    }
