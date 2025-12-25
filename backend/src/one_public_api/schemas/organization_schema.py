from typing import Any, Dict, Optional

from sqlmodel import Field

from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins import IdMixin
from one_public_api.models.system.organization_model import OrganizationBase
from one_public_api.schemas.category_schema import CategoryPublicResponse
from one_public_api.schemas.category_schema import example_base as category_example
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "name": "One Public Framework",
    "nickname": "OPF",
    "description": "One Public Framework.",
    "category": category_example,
}

example_datetime: Dict[str, Any] = {
    "createdAt": "2023-01-01T00:00:00+00:00",
    "updatedAt": "2023-01-01T00:00:00+00:00",
}


# ----- Public Schemas -----------------------------------------------------------------


class OrganizationPublicResponse(OrganizationBase, IdMixin):
    category: Optional[CategoryPublicResponse] = Field(
        default=None,
        description=_("Category"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_base, **example_datetime}],
        },
    }
