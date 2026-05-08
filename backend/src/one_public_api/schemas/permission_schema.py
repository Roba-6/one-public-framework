from typing import Any, Dict, List
from uuid import UUID

from sqlmodel import Field

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins import IdMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.permission_model import PermissionBase
from one_public_api.schemas.action_schema import ActionPublicResponse
from one_public_api.schemas.action_schema import example_base as action_example
from one_public_api.schemas.feature_schema import FeaturePublicResponse
from one_public_api.schemas.feature_schema import example_base as feature_example
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "name": "Management",
    "description": "Manage all system configurations.",
}

example_foreigners: Dict[str, Any] = {
    "actions": [action_example],
    "features": [feature_example],
}

example_ids: Dict[str, Any] = {
    "action_ids": [
        "0a3aac6f-5e8c-46ad-ba5a-c78762edcdbc",
        "3ab88789-b4d1-42ec-896a-90a67c7f329c",
    ],
    "feature_ids": [
        "5aa8064c-a40d-42de-bede-26479cbbc085",
        "ce537049-bb76-4fa1-b9fc-2b0f941aa819",
    ],
}

example_datetime: Dict[str, Any] = {
    "createdAt": "2023-01-01T00:00:00+00:00",
    "updatedAt": "2023-01-01T00:00:00+00:00",
}


# ----- Public Schemas -----------------------------------------------------------------


class PermissionPublicResponse(PermissionBase, IdMixin):
    actions: List[ActionPublicResponse] = Field(
        default_factory=list,
        title=_("Actions"),
        description=_("Actions Description"),
    )
    features: List[FeaturePublicResponse] = Field(
        default_factory=list,
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


# ----- Admin Schemas ------------------------------------------------------------------


class PermissionCreateRequest(PermissionBase):
    name: str = Field(
        min_length=constants.LENGTH_3,
        max_length=constants.LENGTH_100,
        description=_("Permission name"),
    )

    action_ids: List[UUID] = Field(
        default_factory=list,
        title=_("Action IDs"),
        description=_("List of action IDs associated with the permission"),
    )

    feature_ids: List[UUID] = Field(
        default_factory=list,
        title=_("Feature IDs"),
        description=_("List of feature IDs associated with the permission"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_ids}]},
    }


class PermissionUpdateRequest(PermissionBase):
    action_ids: List[UUID] = Field(
        default_factory=list,
        title=_("Action IDs"),
        description=_("List of action IDs associated with the permission"),
    )

    feature_ids: List[UUID] = Field(
        default_factory=list,
        title=_("Feature IDs"),
        description=_("List of feature IDs associated with the permission"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_ids}]},
    }


class PermissionResponse(PermissionPublicResponse, TimestampMixin):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_base, **example_datetime}],
        },
    }
