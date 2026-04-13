from typing import TYPE_CHECKING, List, Optional

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


class FeatureBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_13,
        max_length=constants.LENGTH_13,
        description=_("Feature name"),
    )
    description: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_1000,
        description=_("Description"),
    )


class FeatureStatus(SQLModel):
    is_enabled: Optional[bool] = Field(
        default=None,
        description=_("Whether the feature is enabled"),
    )
    requires_auth: Optional[bool] = Field(
        default=None,
        description=_("Whether auth is required"),
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

    name: str = Field(
        nullable=False,
        unique=True,
        min_length=constants.LENGTH_13,
        max_length=constants.LENGTH_13,
        description=_("Feature name"),
    )
    description: str = Field(
        default=None,
        nullable=True,
        max_length=constants.LENGTH_1000,
        description=_("Description"),
    )
    is_enabled: bool = Field(
        default=False,
        nullable=False,
        description=_("Whether the feature is enabled"),
    )
    requires_auth: bool = Field(
        default=True,
        nullable=False,
        description=_("Whether auth is required"),
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
