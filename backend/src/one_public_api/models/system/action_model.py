from typing import TYPE_CHECKING, Any, Dict, List, Optional
from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.links import PermissionActionLink
from one_public_api.models.mixins import IdMixin, MaintenanceMixin, TimestampMixin

if TYPE_CHECKING:
    from one_public_api.models import Permission, User

ACTION_NAME_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_55,
    "title": _("Action name"),
    "description": _(
        "Unique identifier for the action. Used internally for referencing and routing."
    ),
}

ACTION_LABEL_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Action label"),
    "description": _("Display name of the action shown in the user interface."),
}

ACTION_URL_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_255,
    "title": _("Action URL"),
    "description": _(
        "URL path associated with the action. Used for navigation or routing."
    ),
}

ACTION_ICON_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_55,
    "title": _("Action icon"),
    "description": _(
        "Icon name or identifier used to visually represent the action in the UI."
    ),
}

ACTION_COMPONENT_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Component name"),
    "description": _(
        "Frontend component name responsible for rendering the action view."
    ),
}

ACTION_SHOW_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Visible"),
    "description": _("Determines whether the action is visible in the user interface."),
}

ACTION_DESCRIPTION_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_1000,
    "title": _("Description"),
    "description": _("Detailed description of the action and its purpose."),
}

ACTION_IS_ENABLED_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Enabled"),
    "description": _("Indicates whether the action is active and can be used."),
}

ACTION_REQUIRES_AUTH_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Requires authentication"),
    "description": _(
        "Specifies whether authentication is required to access this action."
    ),
}

ACTION_PARENT_ID_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Parent action ID"),
    "description": _(
        "Identifier of the parent action. Used to define hierarchical relationships "
        "between actions (e.g., menu and sub-menu structure)."
    ),
}


class ActionBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_3,
        **ACTION_NAME_FIELD_KWARGS,
    )
    label: Optional[str] = Field(
        default=None,
        **ACTION_LABEL_FIELD_KWARGS,
    )
    url: Optional[str] = Field(
        default=None,
        **ACTION_URL_FIELD_KWARGS,
    )
    icon: Optional[str] = Field(
        default=None,
        **ACTION_ICON_FIELD_KWARGS,
    )
    component: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_1,
        **ACTION_COMPONENT_FIELD_KWARGS,
    )
    show: Optional[bool] = Field(
        default=None,
        **ACTION_SHOW_FIELD_KWARGS,
    )
    description: Optional[str] = Field(
        default=None,
        **ACTION_DESCRIPTION_FIELD_KWARGS,
    )


class ActionStatus(SQLModel):
    is_enabled: Optional[bool] = Field(
        default=None,
        **ACTION_IS_ENABLED_FIELD_KWARGS,
    )
    requires_auth: Optional[bool] = Field(
        default=None,
        **ACTION_REQUIRES_AUTH_FIELD_KWARGS,
    )


class ActionForeignIds(SQLModel):
    parent_id: Optional[UUID] = Field(
        default=None,
        foreign_key=settings.DB_TABLE_PRE + "actions.id",
        ondelete="RESTRICT",
        **ACTION_PARENT_ID_FIELD_KWARGS,
    )


class Action(
    ActionBase,
    ActionStatus,
    ActionForeignIds,
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
        **ACTION_NAME_FIELD_KWARGS,
    )
    is_enabled: bool = Field(
        default=False,
        nullable=False,
        **ACTION_IS_ENABLED_FIELD_KWARGS,
    )
    requires_auth: bool = Field(
        default=True,
        nullable=False,
        **ACTION_REQUIRES_AUTH_FIELD_KWARGS,
    )
    show: bool = Field(
        default=False,
        nullable=False,
        **ACTION_SHOW_FIELD_KWARGS,
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
