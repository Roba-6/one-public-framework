from typing import Any, Dict, List, Optional

from sqlmodel import Field

from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins import IdMixin
from one_public_api.models.system.role_model import RoleBase
from one_public_api.schemas.permission_schema import PermissionPublicResponse
from one_public_api.schemas.permission_schema import example_base as permission_example
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "name": "Super Admin",
    "description": "Super Admin Role.",
    "permissions": [permission_example],
}

example_datetime: Dict[str, Any] = {
    "createdAt": "2023-01-01T00:00:00+00:00",
    "updatedAt": "2023-01-01T00:00:00+00:00",
}


# ----- Public Schemas -----------------------------------------------------------------


class RolePublicResponse(RoleBase, IdMixin):
    permissions: Optional[List[PermissionPublicResponse]] = Field(
        default=None,
        description=_("Role"),
    )
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_base, **example_datetime}],
        },
    }
