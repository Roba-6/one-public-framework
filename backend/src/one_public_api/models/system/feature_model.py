from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.maintenance_mixin import MaintenanceMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin
from one_public_api.models.system.user_model import User


class FeatureBase(SQLModel):
    name: str | None = Field(
        default=None,
        min_length=constants.MAX_LENGTH_13,
        max_length=constants.MAX_LENGTH_13,
        description=_("The name of the feature."),
    )
    description: str | None = Field(
        default=None,
        max_length=constants.MAX_LENGTH_1000,
        description=_("Additional details or explanation about the configuration."),
    )
    is_enabled: bool | None = Field(
        default=None,
        description=_("A Boolean flag indicating whether the feature is enabled."),
    )
    requires_auth: bool | None = Field(
        default=None,
        description=_(
            "A Boolean flag indicating whether the feature requires authentication."
        ),
    )


class Feature(FeatureBase, TimestampMixin, MaintenanceMixin, IdMixin, table=True):
    __tablename__ = constants.DB_PREFIX_SYS + "features"

    name: str = Field(
        unique=True,
        min_length=constants.MAX_LENGTH_13,
        max_length=constants.MAX_LENGTH_13,
        description=_("The name of the feature."),
    )
    is_enabled: bool = Field(
        default=False,
        description=_("A Boolean flag indicating whether the feature is enabled."),
    )
    requires_auth: bool = Field(
        default=True,
        description=_(
            "A Boolean flag indicating whether the feature requires authentication."
        ),
    )
    creator: "User" = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Feature.created_by]",
            "primaryjoin": "Feature.created_by==User.id",
        }
    )
    updater: "User" = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Feature.updated_by]",
            "primaryjoin": "Feature.updated_by==User.id",
        }
    )
