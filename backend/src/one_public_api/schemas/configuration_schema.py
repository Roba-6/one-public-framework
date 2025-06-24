from typing import Any, Dict

from one_public_api.common.utility.string import to_camel
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.configuration_model import ConfigurationBase
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

example_id: Dict[str, Any] = {"id": "a83ab523-0a9e-4136-9602-f16a35c955a6"}

example_audit: Dict[str, Any] = {
    "createdBy": "a83ab523-0a9e-4136-9602-f16a35c955a6",
    "createdAt": "2023-01-01T00:00:00+00:00",
    "updatedBy": "a83ab523-0a9e-4136-9602-f16a35c955a6",
    "updatedAt": "2023-01-01T00:00:00+00:00",
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
        "json_schema_extra": {"examples": [example_base]},
    }


class ConfigurationUpdateRequest(ConfigurationBase):
    options: Dict[str, Any] = {}

    model_config = {
        "alias_generator": to_camel,
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
