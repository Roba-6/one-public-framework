from typing import Any, Dict, List

from sqlmodel import Field

from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins import IdMixin
from one_public_api.models.system.permission_model import PermissionBase
from one_public_api.schemas.action_schema import ActionPublicResponse
from one_public_api.schemas.action_schema import example_base as action_example
from one_public_api.schemas.feature_schema import FeaturePublicResponse
from one_public_api.schemas.feature_schema import example_base as feature_example
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "name": "Management",
    "description": "Manage all system configurations.",
    "actions": [action_example],
    "features": [feature_example],
}

example_datetime: Dict[str, Any] = {
    "createdAt": "2023-01-01T00:00:00+00:00",
    "updatedAt": "2023-01-01T00:00:00+00:00",
}


# ----- Public Schemas -----------------------------------------------------------------


class PermissionPublicResponse(PermissionBase, IdMixin):
    actions: List[ActionPublicResponse] = Field(
        title=_("Actions"),
        description=_("Actions Description"),
    )
    features: List[FeaturePublicResponse] = Field(
        title=_("Features"),
        description=_("Features Description"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_base, **example_datetime}],
        },
    }
