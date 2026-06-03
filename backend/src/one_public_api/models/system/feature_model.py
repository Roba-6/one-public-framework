from typing import TYPE_CHECKING, Any, Dict, List, Optional

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.links import PermissionFeatureLink
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.maintenance_mixin import MaintenanceMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.user_model import User

if TYPE_CHECKING:
    from one_public_api.models import Permission

FEATURE_KEY_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_20,
    "title": _("Feature key"),
    "description": _(
        "Unique identifier for the feature. Used internally for referencing."
    ),
}

FEATURE_NAME_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Feature name"),
    "description": _("Feature name that can be modified by the user."),
}

FEATURE_DESCRIPTION_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_1000,
    "title": _("Description"),
    "description": _("Detailed description of the feature."),
}

FEATURE_IS_ENABLED_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Enabled"),
    "description": _("Indicates whether the feature is active and can be used."),
}

FEATURE_REQUIRES_AUTH_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Requires authentication"),
    "description": _(
        "Indicates whether authentication is required to access this feature."
    ),
}


class FeatureBase(SQLModel):
    key: Optional[str] = Field(
        default=None,
        **FEATURE_KEY_FIELD_KWARGS,
    )
    name: Optional[str] = Field(
        default=None,
        **FEATURE_NAME_FIELD_KWARGS,
    )
    description: Optional[str] = Field(
        default=None,
        **FEATURE_DESCRIPTION_FIELD_KWARGS,
    )


class FeatureStatus(SQLModel):
    is_enabled: Optional[bool] = Field(
        default=None,
        **FEATURE_IS_ENABLED_FIELD_KWARGS,
    )
    requires_auth: Optional[bool] = Field(
        default=None,
        **FEATURE_REQUIRES_AUTH_FIELD_KWARGS,
    )


class Feature(
    FeatureBase,
    FeatureStatus,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    """Represents a feature model within the database."""

    __tablename__ = settings.DB_TABLE_PRE + "features"

    key: str = Field(
        nullable=False,
        unique=True,
        **FEATURE_KEY_FIELD_KWARGS,
    )
    description: str = Field(
        default=None,
        nullable=True,
        **FEATURE_DESCRIPTION_FIELD_KWARGS,
    )
    is_enabled: bool = Field(
        default=False,
        nullable=False,
        **FEATURE_IS_ENABLED_FIELD_KWARGS,
    )
    requires_auth: bool = Field(
        default=True,
        nullable=False,
        **FEATURE_REQUIRES_AUTH_FIELD_KWARGS,
    )

    creator: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Feature.created_by]",
            "primaryjoin": "Feature.created_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    updater: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Feature.updated_by]",
            "primaryjoin": "Feature.updated_by==User.id",
            "remote_side": "[User.id]",
        }
    )

    permissions: List["Permission"] = Relationship(
        back_populates="features", link_model=PermissionFeatureLink
    )
