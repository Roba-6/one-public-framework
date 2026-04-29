from typing import Any, Dict, Optional, Self

from sqlmodel import Field

from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins import IdMixin
from one_public_api.models.system.action_model import (
    ACTION_NAME_FIELD_KWARGS,
    ActionBase,
    ActionForeignIds,
    ActionStatus,
)
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "name": "system",
    "label": "menu.system",
    "url": "/system",
    "icon": "MonitorCog",
    "component": "SystemPage",
    "show": True,
    "description": "Super Admin Role.",
}

example_status: Dict[str, Any] = {
    "is_enabled": True,
    "requires_auth": False,
}

example_datetime: Dict[str, Any] = {
    "createdAt": "2023-01-01T00:00:00+00:00",
    "updatedAt": "2023-01-01T00:00:00+00:00",
}


# ----- Public Schemas -----------------------------------------------------------------


class ActionPublicResponse(ActionBase, IdMixin):
    parent: Optional[Self] = Field(
        default=None,
        title=_("Parent Action"),
        description=_("Parent Action Description"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_base, **example_datetime}],
        },
    }


# ----- Admin Schemas ------------------------------------------------------------------


class ActionCreateRequest(ActionBase, ActionStatus, ActionForeignIds):
    name: str = Field(**ACTION_NAME_FIELD_KWARGS)

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_status}]},
    }


class ActionUpdateRequest(ActionBase, ActionStatus, ActionForeignIds):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_status}]},
    }


class ActionResponse(ActionPublicResponse, ActionStatus):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_base, **example_datetime}],
        },
    }
