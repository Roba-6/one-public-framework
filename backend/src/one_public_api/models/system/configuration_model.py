from enum import IntEnum
from typing import Any, Dict, Optional
from uuid import UUID

from sqlalchemy import Enum as SQLEnum
from sqlmodel import JSON, Column, Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins import IdMixin, MaintenanceMixin, TimestampMixin
from one_public_api.models.system.user_model import User


class ConfigurationType(IntEnum):
    """
    Enumeration for different configuration types.

    Attributes
    ----------
    OTHER : int
        Represents undefined or unclassified configuration.
    SYS : int
        Represents system-related configuration.
    API : int
        Represents API-related configuration.
    UI : int
        Represents UI-related configuration.
    """

    OTHER = 0
    SYS = 1
    API = 2
    UI = 3


class ConfigurationBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.MAX_LENGTH_6,
        max_length=constants.MAX_LENGTH_100,
        description=_("Configuration name"),
    )
    key: Optional[str] = Field(
        default=None,
        min_length=constants.MAX_LENGTH_3,
        max_length=constants.MAX_LENGTH_100,
        description=_("Configuration key"),
    )
    value: Optional[str] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_500,
        description=_("Configuration value"),
    )
    type: Optional[ConfigurationType] = Field(
        default=None,
        description=_("Configuration type"),
    )
    options: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        sa_column=Column(JSON),
        description=_("Configuration options"),
    )
    description: Optional[str] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_1000,
        description=_("Configuration description"),
    )


class Configuration(
    ConfigurationBase,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = constants.DB_PREFIX_SYS + "configurations"

    name: str = Field(
        default=None,
        nullable=True,
        min_length=constants.MAX_LENGTH_6,
        max_length=constants.MAX_LENGTH_100,
        description=_("Configuration name"),
    )
    key: str = Field(
        nullable=False,
        min_length=constants.MAX_LENGTH_3,
        max_length=constants.MAX_LENGTH_100,
        description=_("Configuration key"),
    )
    value: str = Field(
        nullable=False,
        max_length=constants.MAX_LENGTH_500,
        description=_("Configuration value"),
    )
    type: ConfigurationType = Field(
        default=ConfigurationType.OTHER,
        sa_column=Column(SQLEnum(ConfigurationType, name="configuration_type")),
        description=_("Configuration type"),
    )
    description: str = Field(
        default=None,
        nullable=True,
        max_length=constants.MAX_LENGTH_1000,
        description=_("Configuration description"),
    )
    user_id: Optional[UUID] = Field(
        default=None,
        foreign_key=constants.DB_PREFIX_SYS + "users.id",
        description=_("Owner of configuration item"),
    )

    user: "User" = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Configuration.user_id]",
            "primaryjoin": "Configuration.user_id==User.id",
            "remote_side": "[User.id]",
        }
    )
    creator: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Configuration.created_by]",
            "primaryjoin": "Configuration.created_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    updater: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Configuration.updated_by]",
            "primaryjoin": "Configuration.updated_by==User.id",
            "remote_side": "[User.id]",
        }
    )
