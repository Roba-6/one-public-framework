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
    name: str = Field(
        default=None,
        min_length=constants.LENGTH_1,
        max_length=constants.LENGTH_255,
        description=_("Attachment name"),
    )


class AttachmentOption(SQLModel):
    mime_type: str = Field(
        nullable=False,
        max_length=constants.LENGTH_55,
        description=_("MIME type"),
    )
    path: str = Field(
        nullable=False,
        max_length=constants.LENGTH_255,
        description=_("save path"),
    )


class Attachment(
    AttachmentBase,
    AttachmentOption,
    BelongToMixin,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "attachments"

    category: Optional["Category"] = Relationship(link_model=CategoryAttachmentLink)
    organization: Optional["Organization"] = Relationship(
        link_model=AttachmentOrganizationLink
    )
