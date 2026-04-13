from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models import Action, Feature
from one_public_api.models.links import PermissionActionLink, PermissionFeatureLink
from one_public_api.models.mixins import IdMixin, MaintenanceMixin, TimestampMixin

if TYPE_CHECKING:
    from one_public_api.models import User


class PermissionBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_3,
        max_length=constants.LENGTH_100,
        description=_("Feature name"),
    )
    description: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_1000,
        description=_("Description"),
    )


class Permission(
    PermissionBase,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "permissions"

    creator: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Permission.created_by]",
            "primaryjoin": "Permission.created_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    updater: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Permission.updated_by]",
            "primaryjoin": "Permission.updated_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    features: List["Feature"] = Relationship(
        back_populates="permissions", link_model=PermissionFeatureLink
    )
    actions: List["Action"] = Relationship(
        back_populates="permissions", link_model=PermissionActionLink
    )
