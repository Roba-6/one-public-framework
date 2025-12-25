from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.links import PermissionActionLink
from one_public_api.models.mixins import IdMixin, MaintenanceMixin, TimestampMixin

if TYPE_CHECKING:
    from one_public_api.models import Permission, User


class ActionBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_3,
        max_length=constants.LENGTH_13,
        description=_("Action name"),
    )
    label: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_100,
        description=_("Action label"),
    )
    url: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_255,
        description=_("Action URL"),
    )
    icon: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_55,
        description=_("Action icon"),
    )
    component: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_1,
        max_length=constants.LENGTH_100,
        description=_("Component name"),
    )
    show: Optional[bool] = Field(
        default=None,
        description=_("Show or hide"),
    )
    description: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_1000,
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
    parent_id: Optional[UUID] = Field(
        default=None,
        foreign_key=settings.DB_TABLE_PRE + "actions.id",
        ondelete="RESTRICT",
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
        min_length=constants.LENGTH_9,
        max_length=constants.LENGTH_13,
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

    creator: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Action.created_by]",
            "primaryjoin": "Action.created_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    updater: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Action.updated_by]",
            "primaryjoin": "Action.updated_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    parent: Optional["Action"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Action.parent_id]",
            "primaryjoin": "Action.parent_id==Action.id",
            "remote_side": "[Action.id]",
        }
    )
    permissions: List["Permission"] = Relationship(
        back_populates="actions", link_model=PermissionActionLink
    )
