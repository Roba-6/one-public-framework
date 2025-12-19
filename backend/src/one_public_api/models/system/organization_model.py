from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models import Category, Configuration
from one_public_api.models.links import CategoryOrganizationLink, OrganizationUserLink
from one_public_api.models.links.configuration_organization_link import (
    ConfigurationOrganizationLink,
)
from one_public_api.models.mixins import IdMixin, MaintenanceMixin, TimestampMixin
from one_public_api.models.mixins.address_mixin import AddressMixin
from one_public_api.models.mixins.belong_to_mixin import BelongToMixin

if TYPE_CHECKING:
    from one_public_api.models import User


class OrganizationBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_1,
        max_length=constants.LENGTH_100,
        description=_("Organization name"),
    )
    nickname: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_100,
        description=_("Nickname"),
    )
    description: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_1000,
        description=_("Description"),
    )


class OrganizationStatus(SQLModel):
    is_enabled: Optional[bool] = Field(
        default=None,
        description=_("Whether the organization is enabled"),
    )


class Organization(
    OrganizationBase,
    OrganizationStatus,
    BelongToMixin,
    TimestampMixin,
    MaintenanceMixin,
    AddressMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "organizations"

    name: str = Field(
        nullable=False,
        unique=True,
        min_length=constants.LENGTH_1,
        max_length=constants.LENGTH_100,
        description=_("User name"),
    )

    creator: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Organization.created_by]",
            "primaryjoin": "Organization.created_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    updater: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Organization.updated_by]",
            "primaryjoin": "Organization.updated_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    organization: Optional["Organization"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Organization.organization_id]",
            "primaryjoin": "Organization.organization_id==Organization.id",
            "remote_side": "[Organization.id]",
        }
    )

    users: List["User"] = Relationship(
        back_populates="organization", link_model=OrganizationUserLink
    )
    category: Optional["Category"] = Relationship(link_model=CategoryOrganizationLink)
    configurations: List["Configuration"] = Relationship(
        link_model=ConfigurationOrganizationLink
    )
