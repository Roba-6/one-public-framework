from enum import IntEnum
from typing import Optional
from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _


class TokenType(IntEnum):
    ACCESS = 1
    REFRESH = 2


class TokenBase(SQLModel):
    token: str = Field(
        max_length=constants.MAX_LENGTH_500,
        description=_("Token"),
    )
    type: TokenType = Field(
        default=TokenType.ACCESS,
        description=_("Token type"),
    )
    user_id: Optional[UUID] = Field(
        default=None,
        nullable=True,
        foreign_key=constants.DB_PREFIX_SYS + "users.id",
        description=_("Owner of token"),
    )


class Token(TokenBase, table=True):
    """Represents a token model within the database."""

    __tablename__ = constants.DB_PREFIX_SYS + "tokens"
