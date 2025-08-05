from typing import List, Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins import MaintenanceMixin, PasswordMixin, TimestampMixin
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.system.token_model import Token


class UserBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.MAX_LENGTH_3,
        max_length=constants.MAX_LENGTH_55,
        description=_("User name"),
    )
    email: Optional[EmailStr] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_128,
        description=_("User's email address"),
    )
    firstname: Optional[str] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_100,
        description=_("First name"),
    )
    lastname: Optional[str] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_100,
        description=_("Last name"),
    )
    nickname: Optional[str] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_55,
        description=_("Display nickname"),
    )


class UserStatus(SQLModel):
    is_disabled: Optional[bool] = Field(
        default=None,
        description=_("Whether the account is disabled"),
    )
    is_locked: Optional[bool] = Field(
        default=None,
        description=_("Whether the account is locked"),
    )
    login_failed_times: Optional[int] = Field(
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

    __tablename__ = constants.DB_PREFIX_SYS + "users"

    name: str = Field(
        nullable=False,
        unique=True,
        min_length=constants.MAX_LENGTH_3,
        max_length=constants.MAX_LENGTH_55,
        description=_("User name"),
    )
    email: EmailStr = Field(
        nullable=False,
        unique=True,
        max_length=constants.MAX_LENGTH_128,
        description=_("User's email address"),
    )
    firstname: str = Field(
        default=None,
        nullable=True,
        max_length=constants.MAX_LENGTH_100,
        description=_("First name"),
    )
    lastname: str = Field(
        default=None,
        nullable=True,
        max_length=constants.MAX_LENGTH_100,
        description=_("Last name"),
    )
    nickname: str = Field(
        default=None,
        nullable=True,
        max_length=constants.MAX_LENGTH_55,
        description=_("Display nickname"),
    )
    is_disabled: bool = Field(
        default=False,
        nullable=False,
        description=_("Whether the account is disabled"),
    )
    is_locked: bool = Field(
        default=False,
        nullable=False,
        description=_("Whether the account is locked"),
    )
    login_failed_times: int = Field(
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
