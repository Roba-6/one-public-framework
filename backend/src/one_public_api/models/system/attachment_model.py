from typing import TYPE_CHECKING, Any, Dict, Optional

from sqlalchemy import BigInteger
from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.links import AttachmentOrganizationLink
from one_public_api.models.links.category_attachment_link import CategoryAttachmentLink
from one_public_api.models.mixins import (
    BelongToMixin,
    IdMixin,
    MaintenanceMixin,
    TimestampMixin,
)

if TYPE_CHECKING:
    from one_public_api.models import Category, Organization

ATTACHMENT_NAME_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_255,
    "title": _("Attachment name"),
    "description": _("Attachment name that can be modified by the user."),
}

ATTACHMENT_DESCRIPTION_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_500,
    "title": _("Description"),
    "description": _("Detailed description of the attachment and its purpose."),
}

ATTACHMENT_REQUIRES_AUTH_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Requires authentication"),
    "description": _(
        "Specifies whether authentication is required to access this action."
    ),
}

ATTACHMENT_PATH_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_500,
    "title": _("Save path"),
    "description": _(
        "For uploaded attachments, this field stores the file path. "
        "For online resources, it stores the resource URL."
    ),
}

ATTACHMENT_THUMBNAIL_PATH_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_500,
    "title": _("Thumbnail path"),
    "description": _(
        "For uploaded attachments, this field stores the thumbnail file path. "
        "For online resources, it stores the thumbnail resource URL."
    ),
}

ATTACHMENT_ORIGINAL_NAME_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_255,
    "title": _("Original file name"),
    "description": _("Original file name of the uploaded attachment."),
}

ATTACHMENT_MIME_TYPE_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_55,
    "title": _("MIME type"),
    "description": _(
        "Internet media type used to identify the format of the attachment."
    ),
}

ATTACHMENT_SIZE_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("File size"),
    "description": _("File size in bytes"),
}

ATTACHMENT_DOWNLOAD_COUNT_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Download count"),
    "description": _("Total number of downloads for the attachment."),
}


class AttachmentBase(
    SQLModel,
):
    name: Optional[str] = Field(
        default=None,
        **ATTACHMENT_NAME_FIELD_KWARGS,
    )
    description: Optional[str] = Field(
        default=None,
        **ATTACHMENT_DESCRIPTION_FIELD_KWARGS,
    )


class AttachmentStatus(SQLModel):
    requires_auth: Optional[bool] = Field(
        default=None,
        **ATTACHMENT_REQUIRES_AUTH_FIELD_KWARGS,
    )


class AttachmentOption(SQLModel):
    path: Optional[str] = Field(
        default=None,
        **ATTACHMENT_PATH_FIELD_KWARGS,
    )
    thumbnail_path: Optional[str] = Field(
        default=None,
        **ATTACHMENT_THUMBNAIL_PATH_FIELD_KWARGS,
    )


class AttachmentMeta(SQLModel):
    original_name: str = Field(
        default=None,
        nullable=True,
        **ATTACHMENT_ORIGINAL_NAME_FIELD_KWARGS,
    )
    mime_type: str = Field(
        nullable=False,
        **ATTACHMENT_MIME_TYPE_FIELD_KWARGS,
    )
    size: int = Field(
        default=0,
        nullable=False,
        sa_type=BigInteger,
        ge=0,
        **ATTACHMENT_SIZE_FIELD_KWARGS,
    )
    download_count: int = Field(
        default=0,
        nullable=False,
        **ATTACHMENT_DOWNLOAD_COUNT_FIELD_KWARGS,
    )


class Attachment(
    AttachmentBase,
    AttachmentStatus,
    AttachmentOption,
    AttachmentMeta,
    BelongToMixin,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "attachments"

    description: str = Field(
        default=None,
        nullable=True,
        **ATTACHMENT_DESCRIPTION_FIELD_KWARGS,
    )
    requires_auth: bool = Field(
        default=True,
        nullable=False,
        **ATTACHMENT_REQUIRES_AUTH_FIELD_KWARGS,
    )
    path: str = Field(
        nullable=False,
        **ATTACHMENT_PATH_FIELD_KWARGS,
    )

    category: Optional["Category"] = Relationship(link_model=CategoryAttachmentLink)
    organization: Optional["Organization"] = Relationship(
        link_model=AttachmentOrganizationLink
    )
