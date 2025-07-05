from typing import Any, Dict

from pydantic import computed_field

from one_public_api.common.utility.str import to_camel
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.feature_model import FeatureBase
from one_public_api.schemas.response_schema import example_audit, example_id

example_base: Dict[str, Any] = {
    "name": "SYS-COF-P-LST",
    "description": "List Public Configurations.",
    "is_enabled": True,
    "requires_auth": False,
}


# ----- Public Schemas -----------------------------------------------------------------


class FeaturePublicResponse(FeatureBase, IdMixin):
    @computed_field
    def category(self) -> str | None:
        if self.name is None:
            return None
        else:
            return self.name[:7]

    model_config = {
        "alias_generator": to_camel,
        "json_schema_extra": {
            "examples": [{**example_base, **example_id}],
        },
    }


# ----- Admin Schemas ------------------------------------------------------------------


class FeatureCreateRequest(FeatureBase):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [example_base]},
    }


class FeatureUpdateRequest(FeatureBase):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [example_base]},
    }


class FeatureResponse(FeaturePublicResponse, TimestampMixin):
    options: Dict[str, Any] = {}

    model_config = {
        "alias_generator": to_camel,
        "json_schema_extra": {
            "examples": [{**example_base, **example_audit, **example_id}],
        },
    }
