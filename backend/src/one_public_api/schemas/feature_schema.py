from typing import Any, Dict

from pydantic import computed_field
from sqlmodel import Field

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.feature_model import FeatureBase, FeatureStatus
from one_public_api.schemas.response_schema import example_audit, example_id

example_base: Dict[str, Any] = {
    "name": "SYS-COF-P-LST",
    "description": "List Public Features.",
    "classification": "SYS-COF",
}

example_status: Dict[str, Any] = {
    "is_enabled": True,
    "requires_auth": False,
}


# ----- Public Schemas -----------------------------------------------------------------


class FeaturePublicResponse(FeatureBase, IdMixin):
    @computed_field(
        return_type=str,
        title=_("Classification"),
        description=_("Classification Description"),
    )
    def classification(self) -> str | None:
        if self.name is None:
            return None
        else:
            return self.name[:7]

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_base, **example_id}],
        },
    }


# ----- Admin Schemas ------------------------------------------------------------------


class FeatureCreateRequest(FeatureBase):
    name: str = Field(
        min_length=constants.LENGTH_13,
        max_length=constants.LENGTH_13,
        description=_("Feature name"),
    )
    is_enabled: bool = Field(
        description=_("Whether the feature is enabled"),
    )
    requires_auth: bool = Field(
        description=_("Whether auth is required"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_status}]},
    }


class FeatureUpdateRequest(FeatureBase):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_status}]},
    }


class FeatureResponse(FeaturePublicResponse, FeatureStatus, TimestampMixin):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {**example_base, **example_status, **example_audit, **example_id}
            ],
        },
    }
