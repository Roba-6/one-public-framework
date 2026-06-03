from typing import TYPE_CHECKING, Any, Dict, List, Optional

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models import Action, Feature
from one_public_api.models.links import PermissionActionLink, PermissionFeatureLink
from one_public_api.models.mixins import IdMixin, MaintenanceMixin, TimestampMixin

if TYPE_CHECKING:
    from one_public_api.models import User

PERMISSION_KEY_FIELD_KWARGS: Dict[str, Any] = {
    "min_length": constants.LENGTH_3,
    "max_length": constants.LENGTH_100,
    "title": _("Permission key"),
    "description": _(
        "Unique identifier for the permission. Used internally for referencing."
    ),
}

PERMISSION_NAME_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Permission name"),
    "description": _("Display name of the permission."),
}

PERMISSION_DESCRIPTION_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_1000,
    "title": _("Description"),
    "description": _("Detailed description of the permission."),
}


class PermissionBase(SQLModel):
    key: Optional[str] = Field(
        default=None,
        **PERMISSION_KEY_FIELD_KWARGS,
    )
    name: Optional[str] = Field(
        default=None,
        **PERMISSION_NAME_FIELD_KWARGS,
    )
    description: Optional[str] = Field(
        default=None,
        **PERMISSION_DESCRIPTION_FIELD_KWARGS,
    )


class Permission(
    PermissionBase,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "permissions"

    key: str = Field(
        nullable=False,
        unique=True,
        **PERMISSION_KEY_FIELD_KWARGS,
    )
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
