from typing import Any, Dict

from one_public_api.common.utility.str import to_camel
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.system.feature_model import FeatureBase

example_base: Dict[str, Any] = {
    "name": "SYS-COF-P-LST",
    "description": "List Public Configurations.",
    "is_enabled": True,
    "requires_auth": False,
}

example_id: Dict[str, Any] = {"id": "a83ab523-0a9e-4136-9602-f16a35c955a6"}


# ----- Public Schemas -----------------------------------------------------------------


class FeaturePublicResponse(FeatureBase, IdMixin):
    model_config = {
        "alias_generator": to_camel,
        "json_schema_extra": {
            "examples": [{**example_base, **example_id}],
        },
    }
