from typing import Any, Dict, List, Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models import Comment
from one_public_api.models.links import (
    AttachmentUserLink,
    ConfigurationUserLink,
    NotificationUserLink,
    OrganizationUserLink,
)
from one_public_api.models.links.role_user_link import RoleUserLink
from one_public_api.models.mixins import MaintenanceMixin, PasswordMixin, TimestampMixin
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.system.attachment_model import Attachment
from one_public_api.models.system.configuration_model import Configuration
from one_public_api.models.system.organization_model import Organization
from one_public_api.models.system.role_model import Role
from one_public_api.models.system.token_model import Token

USER_NAME_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_55,
    "title": _("User name"),
    "description": _("Unique username used for login and system identification."),
}

USER_EMAIL_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Email address"),
    "description": _("User's email address used for authentication and communication."),
}

USER_FIRSTNAME_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("First name"),
    "description": _("User's given name."),
}

USER_LASTNAME_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Last name"),
    "description": _("User's family name."),
}

USER_NICKNAME_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Display nickname"),
    "description": _(
        "Nickname displayed in the user interface instead of the full name."
    ),
}

USER_IS_ENABLED_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Enabled"),
    "description": _(
        "Indicates whether the user account is active and allowed to access the system."
    ),
}

USER_IS_LOCKED_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Locked"),
    "description": _(
        "Indicates whether the account is locked due to security reasons "
        "(e.g., too many failed login attempts)."
    ),
}

USER_FAILED_ATTEMPTS_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Failed login attempts"),
    "description": _(
        "Number of consecutive failed login attempts recorded for the account."
    ),
}


class UserBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        **USER_NAME_FIELD_KWARGS,
    )
    email: Optional[EmailStr] = Field(
        default=None,
        **USER_EMAIL_FIELD_KWARGS,
    )
    firstname: Optional[str] = Field(
        default=None,
        **USER_FIRSTNAME_FIELD_KWARGS,
    )
    lastname: Optional[str] = Field(
        default=None,
        **USER_LASTNAME_FIELD_KWARGS,
    )
    nickname: Optional[str] = Field(
        default=None,
        **USER_NICKNAME_FIELD_KWARGS,
    )


class UserStatus(SQLModel):
    is_enabled: Optional[bool] = Field(
        default=None,
        **USER_IS_ENABLED_FIELD_KWARGS,
    )
    is_locked: Optional[bool] = Field(
        default=None,
        **USER_IS_LOCKED_FIELD_KWARGS,
    )
    failed_attempts: Optional[int] = Field(
        default=None,
        **USER_FAILED_ATTEMPTS_FIELD_KWARGS,
    )


class User(
    UserBase,
    UserStatus,
    PasswordMixin,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    """Represents a model within the database."""

    __tablename__ = settings.DB_TABLE_PRE + "users"

    name: str = Field(
        nullable=False,
        unique=True,
        min_length=constants.LENGTH_3,
        **USER_NAME_FIELD_KWARGS,
    )
    email: EmailStr = Field(
        nullable=False,
        unique=True,
        **USER_EMAIL_FIELD_KWARGS,
    )
    is_enabled: bool = Field(
        default=True,
        nullable=False,
        **USER_IS_ENABLED_FIELD_KWARGS,
    )
    is_locked: bool = Field(
        default=False,
        nullable=False,
        **USER_IS_LOCKED_FIELD_KWARGS,
    )
    failed_attempts: int = Field(
        default=0,
        nullable=False,
        ge=0,
        **USER_FAILED_ATTEMPTS_FIELD_KWARGS,
    )

    creator: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[User.created_by]",
            "primaryjoin": "User.created_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    updater: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[User.updated_by]",
            "primaryjoin": "User.updated_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    tokens: List[Token] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    configurations: List[Configuration] = Relationship(
        back_populates="users", link_model=ConfigurationUserLink
    )
    organization: Optional[Organization] = Relationship(
        back_populates="users", link_model=OrganizationUserLink
    )
    role: Optional[Role] = Relationship(link_model=RoleUserLink)
    attachment: Optional[Attachment] = Relationship(link_model=AttachmentUserLink)
    notification_links: List[NotificationUserLink] = Relationship(back_populates="user")
    comments: List[Comment] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"foreign_keys": "[Comment.user_id]"},
    )
