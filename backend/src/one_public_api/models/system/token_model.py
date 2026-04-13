from enum import IntEnum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.mixins import IdMixin

if TYPE_CHECKING:
    from one_public_api.models.system.user_model import User


class TokenType(IntEnum):
    ACCESS = 1
    REFRESH = 2


class TokenBase(SQLModel):
    token: str = Field(
        max_length=constants.LENGTH_500,
        description=_("Token"),
    )
    type: TokenType = Field(
        default=TokenType.ACCESS,
        description=_("Token type"),
    )
    user_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "users.id",
        ondelete="CASCADE",
        description=_("Owner of token"),
    )


class Token(TokenBase, IdMixin, table=True):
    """Represents a token model within the database."""

    __tablename__ = settings.DB_TABLE_PRE + "tokens"

    user: "User" = Relationship(
        back_populates="tokens",
        sa_relationship_kwargs={
            "foreign_keys": "[Token.user_id]",
            "primaryjoin": "Token.user_id==User.id",
            "remote_side": "[User.id]",
        },
    )
