from typing import TYPE_CHECKING, List, Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.links import ConfigurationUserLink, OrganizationUserLink
from one_public_api.models.links.role_user_link import RoleUserLink
from one_public_api.models.mixins import MaintenanceMixin, PasswordMixin, TimestampMixin
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.system.role_model import Role
from one_public_api.models.system.token_model import Token

if TYPE_CHECKING:
    from one_public_api.models import Configuration, Organization


class UserBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_3,
        max_length=constants.LENGTH_55,
        description=_("User name"),
    )
    email: Optional[EmailStr] = Field(
        default=None,
        max_length=constants.LENGTH_128,
        description=_("User's email address"),
    )
    firstname: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_100,
        description=_("First name"),
    )
    lastname: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_100,
        description=_("Last name"),
    )
    nickname: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_55,
        description=_("Display nickname"),
    )


class UserStatus(SQLModel):
    is_enabled: Optional[bool] = Field(
        default=None,
        description=_("Whether the account is enabled"),
    )
    is_locked: Optional[bool] = Field(
        default=None,
        description=_("Whether the account is locked"),
    )
    failed_attempts: Optional[int] = Field(
        default=None,
        description=_("Number of failed login attempts"),
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
        max_length=constants.LENGTH_55,
        description=_("User name"),
    )
    email: EmailStr = Field(
        nullable=False,
        unique=True,
        max_length=constants.LENGTH_128,
        description=_("User's email address"),
    )
    firstname: str = Field(
        default=None,
        nullable=True,
        max_length=constants.LENGTH_100,
        description=_("First name"),
    )
    lastname: str = Field(
        default=None,
        nullable=True,
        max_length=constants.LENGTH_100,
        description=_("Last name"),
    )
    nickname: str = Field(
        default=None,
        nullable=True,
        max_length=constants.LENGTH_55,
        description=_("Display nickname"),
    )
    is_enabled: bool = Field(
        default=True,
        nullable=False,
        description=_("Whether the account is enabled"),
    )
    is_locked: bool = Field(
        default=False,
        nullable=False,
        description=_("Whether the account is locked"),
    )
    failed_attempts: int = Field(
        default=0,
        nullable=False,
        description=_("Number of failed login attempts"),
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
    configurations: List["Configuration"] = Relationship(
        back_populates="users", link_model=ConfigurationUserLink
    )
    organizations: List["Organization"] = Relationship(
        back_populates="users", link_model=OrganizationUserLink
    )

    roles: List["Role"] = Relationship(link_model=RoleUserLink)
