from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.mixins.maintenance_mixin import MaintenanceMixin
from one_public_api.models.mixins.password_mixin import PasswordMixin
from one_public_api.models.mixins.timestamp_mixin import TimestampMixin


class UserBase(SQLModel):
    name: str | None = Field(
        default=None,
        min_length=constants.MAX_LENGTH_3,
        max_length=constants.MAX_LENGTH_55,
        description=_("The name of the user."),
    )
    email: EmailStr | None = Field(
        default=None,
        max_length=128,
        description=_("The email address of the user."),
    )
    firstname: str | None = Field(
        default=None,
        max_length=constants.MAX_LENGTH_100,
        description=_("The first name of the user."),
    )
    lastname: str | None = Field(
        default=None,
        max_length=constants.MAX_LENGTH_100,
        description=_("The last name of the user."),
    )
    nickname: str | None = Field(
        default=None,
        max_length=constants.MAX_LENGTH_55,
        description=_("The nickname of the user."),
    )
    is_disabled: bool | None = Field(
        default=False,
        description=_("A Boolean flag indicating whether the user is disabled."),
    )
    is_locked: bool | None = Field(
        default=False,
        description=_("A Boolean flag indicating whether the user is locked."),
    )
    login_failed_times: int | None = Field(
        default=0,
        description=_(
            "Tracks the number of consecutive failed login attempts for the user."
        ),
    )


class User(
    UserBase, PasswordMixin, TimestampMixin, MaintenanceMixin, IdMixin, table=True
):
    __tablename__ = constants.DB_PREFIX_SYS + "users"

    name: str = Field(
        unique=True,
        min_length=constants.MAX_LENGTH_3,
        max_length=constants.MAX_LENGTH_55,
        description=_("The name of the user."),
    )
    email: EmailStr = Field(
        unique=True,
        max_length=128,
        description=_("The email address of the user."),
    )
    is_disabled: bool = Field(
        default=False,
        description=_("A Boolean flag indicating whether the user is disabled."),
    )
    is_locked: bool = Field(
        default=False,
        description=_("A Boolean flag indicating whether the user is locked."),
    )
    login_failed_times: int = Field(
        default=0,
        description=_(
            "Tracks the number of consecutive failed login attempts for the user."
        ),
    )

    creator: "User" = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[User.created_by]",
            "primaryjoin": "User.created_by==User.id",
        }
    )
    updater: "User" = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[User.updated_by]",
            "primaryjoin": "User.updated_by==User.id",
        }
    )
