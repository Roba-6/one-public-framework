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
    from one_public_api.models import Permission


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

    permissions: List["Permission"] = Relationship(link_model=RolePermissionLink)
