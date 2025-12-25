from typing import Any, Dict

from one_public_api.common.utility.str import to_camel
from one_public_api.models.mixins import IdMixin
from one_public_api.models.system.category_model import CategoryBase
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "name": "カテゴリー A",
    "value": "CAT-A",
    "alias": "category-a",
}


# ----- Public Schemas -----------------------------------------------------------------


class CategoryPublicResponse(CategoryBase, IdMixin):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_base}],
        },
    }
