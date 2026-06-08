from typing import Any, Dict

from pydantic import Field

from one_public_api.common.utility.str import to_camel
from one_public_api.models.mixins import IdMixin
from one_public_api.models.system.category_model import (
    CATEGORY_NAME_FIELD_KWARGS,
    CategoryBase,
    CategoryForeignKey,
    CategoryOption,
    CategoryStatus,
)
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "name": "Database",
    "value": "database",
    "alias": "db",
    "description": "Systems for storing, managing, and querying data.",
}
example_option: Dict[str, Any] = {
    "options": {"type": "POST_CATEGORY", "style": {"color": "blue"}},
}
example_foreign_key: Dict[str, Any] = {
    "category_id": "d1ef4d04-ae46-416f-a0d7-77ee3e1ceece",
}
example_status: Dict[str, Any] = {
    "is_enabled": False,
}

# ----- Public Schemas -----------------------------------------------------------------


class CategoryPublicResponse(CategoryBase, CategoryOption, IdMixin):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {
                    **example_id,
                    **example_base,
                    **example_option,
                }
            ],
        },
    }


# ----- Admin Schemas ------------------------------------------------------------------


class CategoryCreateRequest(
    CategoryBase,
    CategoryOption,
    CategoryStatus,
    CategoryForeignKey,
):
    name: str = Field(
        **CATEGORY_NAME_FIELD_KWARGS,
    )
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {
                    **example_base,
                    **example_option,
                    **example_status,
                }
            ],
        },
    }


class CategoryUpdateRequest(CategoryCreateRequest):
    pass


class CategoryResponse(CategoryPublicResponse, CategoryStatus):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {
                    **example_id,
                    **example_base,
                    **example_option,
                    **example_status,
                }
            ],
        },
    }
