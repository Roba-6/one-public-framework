from typing import Any, Dict

from pydantic import computed_field

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.mixins import IdMixin, TimestampMixin
from one_public_api.models.system.attachment_model import (
    AttachmentBase,
    AttachmentMeta,
    AttachmentOption,
    AttachmentStatus,
)
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "name": "Test File",
    "description": "This is a file for testing.",
}

example_option: Dict[str, Any] = {
    "path": "/path/of/file",
}

example_status: Dict[str, Any] = {
    "is_public": True,
}

example_datetime: Dict[str, Any] = {
    "createdAt": "2023-01-01T00:00:00+00:00",
    "updatedAt": "2023-01-01T00:00:00+00:00",
}


# ----- Public Schemas -----------------------------------------------------------------


class AttachmentPublicResponse(AttachmentBase, AttachmentMeta, IdMixin):
    @computed_field(return_type=str, description=_("URL"))
    def url(self) -> str:
        return (
            f"{settings.BASE_URL}{constants.ROUTER_PREFIX_ATTACHMENT}"
            f"{constants.ROUTER_COMMON_ADMIN}/{self.id}/download"
        )

    @computed_field(return_type=str, description=_("PREVIEW"))
    def preview(self) -> str:
        return (
            f"{settings.BASE_URL}{constants.ROUTER_PREFIX_ATTACHMENT}"
            f"{constants.ROUTER_COMMON_ADMIN}/{self.id}/preview"
        )

    @computed_field(return_type=str, description=_("URL"))
    def public_url(self) -> str:
        return (
            f"{settings.BASE_URL}{constants.ROUTER_PREFIX_ATTACHMENT}{self.id}/download"
        )

    @computed_field(return_type=str, description=_("PREVIEW"))
    def public_preview(self) -> str:
        return (
            f"{settings.BASE_URL}{constants.ROUTER_PREFIX_ATTACHMENT}{self.id}/preview"
        )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_id, **example_base}],
        },
    }


# ----- Admin Schemas ------------------------------------------------------------------


class AttachmentCreateRequest(AttachmentBase, AttachmentStatus, AttachmentOption):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_base, **example_status, **example_option}]
        },
    }


class AttachmentUpdateRequest(AttachmentBase, AttachmentStatus, AttachmentOption):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_base, **example_status, **example_option}]
        },
    }


class AttachmentResponse(
    AttachmentPublicResponse, AttachmentOption, AttachmentStatus, TimestampMixin
):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {**example_id, **example_base, **example_status, **example_datetime}
            ],
        },
    }
