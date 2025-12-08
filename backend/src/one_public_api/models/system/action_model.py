from typing import Optional
from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.mixins import IdMixin, MaintenanceMixin, TimestampMixin


class ActionBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.MAX_LENGTH_9,
        max_length=constants.MAX_LENGTH_13,
        description=_("Action name"),
    )
    label: Optional[str] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_100,
        description=_("Message ID of label"),
    )
    url: Optional[str] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_255,
        description=_("Action URL"),
    )
    icon: Optional[str] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_55,
        description=_("Action icon"),
    )
    parent_id: Optional[UUID] = Field(
        default=None,
        foreign_key=settings.DB_TABLE_PRE + "actions.id",
        ondelete="RESTRICT",
    )
    description: Optional[str] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_1000,
        description=_("Description"),
    )


class ActionStatus(SQLModel):
    is_enabled: Optional[bool] = Field(
        default=None,
        description=_("Whether the feature is enabled"),
    )
    requires_auth: Optional[bool] = Field(
        default=None,
        description=_("Whether auth is required"),
    )
    show: Optional[bool] = Field(
        default=None,
        description=_("Show or hide"),
    )


class Action(
    ActionBase,
    ActionStatus,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "actions"

    name: str = Field(
        nullable=False,
        unique=True,
        min_length=constants.MAX_LENGTH_9,
        max_length=constants.MAX_LENGTH_13,
        description=_("Action name"),
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
    show: bool = Field(
        default=False,
        nullable=False,
        description=_("Show or hide"),
    )
