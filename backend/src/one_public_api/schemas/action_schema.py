from typing import Any, Dict, Optional, Self

from sqlmodel import Field

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins import IdMixin
from one_public_api.models.system.action_model import ActionBase, ActionStatus
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


class ActionCreateRequest(ActionBase, ActionStatus):
    name: str = Field(
        min_length=constants.LENGTH_13,
        max_length=constants.LENGTH_13,
        description=_("Action name"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_status}]},
    }


class ActionUpdateRequest(ActionBase, ActionStatus):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {"examples": [{**example_base, **example_status}]},
    }


class ActionResponse(ActionBase, ActionStatus, IdMixin):
    parent: Optional[ActionPublicResponse] = Field(
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
