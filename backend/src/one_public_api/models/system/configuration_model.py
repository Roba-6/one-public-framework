from enum import IntEnum
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from sqlalchemy import Enum as SQLEnum
from sqlmodel import JSON, Column, Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.links import ConfigurationUserLink
from one_public_api.models.mixins import IdMixin, MaintenanceMixin, TimestampMixin

if TYPE_CHECKING:
    from one_public_api.models import User


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
        min_length=constants.LENGTH_6,
        max_length=constants.LENGTH_100,
        description=_("Configuration name"),
    )
    key: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_3,
        max_length=constants.LENGTH_100,
        description=_("Configuration key"),
    )
    value: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_500,
        description=_("Configuration value"),
    )
    type: Optional[ConfigurationType] = Field(
        default=None,
        description=_("Configuration type"),
    )
    description: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_1000,
        description=_("Description"),
    )


class ConfigurationOption(SQLModel):
    options: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        sa_column=Column(JSON),
        description=_("Configuration options"),
    )
    requires_auth: Optional[bool] = Field(
        default=None,
        description=_("Whether auth is required"),
    )


class Configuration(
    ConfigurationBase,
    ConfigurationOption,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    """Represents a configuration model within the database."""

    __tablename__ = settings.DB_TABLE_PRE + "configurations"

    name: str = Field(
        default=None,
        nullable=True,
        min_length=constants.LENGTH_6,
        max_length=constants.LENGTH_100,
        description=_("Configuration name"),
    )
    key: str = Field(
        nullable=False,
        min_length=constants.LENGTH_3,
        max_length=constants.LENGTH_100,
        description=_("Configuration key"),
    )
    value: str = Field(
        default=None,
        nullable=True,
        max_length=constants.LENGTH_500,
        description=_("Configuration value"),
    )
    type: ConfigurationType = Field(
        default=ConfigurationType.OTHER,
        sa_column=Column(SQLEnum(ConfigurationType, name="configuration_type")),
        description=_("Configuration type"),
    )
    requires_auth: bool = Field(
        default=True,
        nullable=False,
        sa_column_kwargs={"server_default": "true", "nullable": False},
        description=_("Whether auth is required"),
    )
    description: str = Field(
        default=None,
        nullable=True,
        max_length=constants.LENGTH_1000,
        description=_("Description"),
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
    users: List["User"] = Relationship(
        back_populates="configurations", link_model=ConfigurationUserLink
    )
