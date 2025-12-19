from typing import Any, Dict

from one_public_api.common.utility.str import to_camel
from one_public_api.models.mixins import IdMixin
from one_public_api.models.system.organization_model import OrganizationBase
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "name": "One Public Framework",
    "nickname": "OPF",
}

example_datetime: Dict[str, Any] = {
    "createdAt": "2023-01-01T00:00:00+00:00",
    "updatedAt": "2023-01-01T00:00:00+00:00",
}


# ----- Public Schemas -----------------------------------------------------------------


class OrganizationPublicResponse(OrganizationBase, IdMixin):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_base, **example_datetime}],
        },
    }
