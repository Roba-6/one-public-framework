from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.links.role_permission_link import RolePermissionLink
from one_public_api.models.mixins import (
    BelongToMixin,
    IdMixin,
    MaintenanceMixin,
    TimestampMixin,
)

if TYPE_CHECKING:
    from one_public_api.models import Organization, Permission, User


class RoleBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_1,
        max_length=constants.LENGTH_100,
        description=_("Role name"),
    )
    description: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_1000,
        description=_("Description"),
    )


class Role(
    RoleBase,
    BelongToMixin,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "roles"

    creator: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Role.created_by]",
            "primaryjoin": "Role.created_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    updater: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Role.updated_by]",
            "primaryjoin": "Role.updated_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    organization: Optional["Organization"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Role.organization_id]",
            "primaryjoin": "Role.organization_id==Organization.id",
            "remote_side": "[Organization.id]",
        }
    )
    permissions: List["Permission"] = Relationship(link_model=RolePermissionLink)
