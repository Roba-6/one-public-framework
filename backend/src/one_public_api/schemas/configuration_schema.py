from typing import Any, Dict

from one_public_api.common.utility.str import to_camel
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.configuration_model import ConfigurationBase
from one_public_api.schemas.response_schema import example_audit, example_id
from one_public_api.schemas.user_schema import UserPublicResponse

example_base: Dict[str, Any] = {
    "name": "Time Zone",
    "key": "time_zone",
    "value": "America/New_York",
    "type": 1,
    "description": "The time zone in which the application is running.",
    "options": {
        "type": "select",
        "values": [
            {"name": "America/New York", "value": "America/New_York"},
            {"name": "Asia/Tokyo", "value": "Asia/Tokyo"},
        ],
    },
}


# ----- Public Schemas -----------------------------------------------------------------


class ConfigurationPublicResponse(ConfigurationBase, TimestampMixin, IdMixin):
    options: Dict[str, Any] = {}
    user: UserPublicResponse | None

    model_config = {
        "alias_generator": to_camel,
        "json_schema_extra": {
            "examples": [{**example_base, **example_id}],
        },
    }


# ----- Admin Schemas ------------------------------------------------------------------


class ConfigurationCreateRequest(ConfigurationBase):
    options: Dict[str, Any] = {}

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [example_base]},
    }


class ConfigurationUpdateRequest(ConfigurationBase):
    options: Dict[str, Any] = {}

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [example_base]},
    }


class ConfigurationResponse(ConfigurationBase, TimestampMixin, IdMixin):
    options: Dict[str, Any] = {}

    model_config = {
        "alias_generator": to_camel,
        "json_schema_extra": {
            "examples": [{**example_base, **example_audit, **example_id}],
        },
    }
