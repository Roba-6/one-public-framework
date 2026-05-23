from typing import TYPE_CHECKING, Optional

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


class AttachmentBase(
    SQLModel,
):
    name: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_255,
        description=_("Attachment name"),
    )
    description: Optional[str] = Field(
        max_length=constants.LENGTH_500,
        description=_("Description of the attachment"),
    )


class AttachmentStatus(SQLModel):
    requires_auth: Optional[bool] = Field(
        default=None,
        description=_(
            "Specifies whether authentication is required to access this attachment."
        ),
    )


class AttachmentOption(SQLModel):
    path: str = Field(
        nullable=False,
        max_length=constants.LENGTH_255,
        description=_("Save Path"),
    )


class AttachmentMeta(SQLModel):
    original_name: str = Field(
        default=None,
        nullable=True,
        max_length=constants.LENGTH_255,
        description=_("Original file name"),
    )
    mime_type: str = Field(
        nullable=False,
        max_length=constants.LENGTH_55,
        description=_("MIME Type"),
    )
    size: int = Field(
        default=0,
        nullable=False,
        ge=0,
        description=_("File size in bytes"),
    )
    download_count: int = Field(
        default=0,
        nullable=False,
        description=_("Download count"),
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
        max_length=constants.LENGTH_500,
        description=_("Description of the attachment"),
    )

    requires_auth: bool = Field(
        default=True,
        nullable=False,
        description=_(
            "Specifies whether authentication is required to access this attachment."
        ),
    )

    category: Optional["Category"] = Relationship(link_model=CategoryAttachmentLink)
    organization: Optional["Organization"] = Relationship(
        link_model=AttachmentOrganizationLink
    )
