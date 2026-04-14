from typing import TYPE_CHECKING
from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.mixins import IdMixin, TimestampMixin
from one_public_api.models.mixins.maintenance_mixin import MaintenanceMixin

if TYPE_CHECKING:
    from one_public_api.models.system.user_model import User


class CommentBase(SQLModel):
    content: str = Field(
        nullable=False,
        min_length=constants.LENGTH_1,
        max_length=constants.LENGTH_1000,
        description=_("Comment Content"),
    )

    user_id: UUID = Field(
        default=None,
        nullable=True,
        foreign_key=settings.DB_TABLE_PRE + "users.id",
        ondelete="CASCADE",
        description=_("Owner of comment"),
    )


class Comment(
    CommentBase,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "comments"

    user: "User" = Relationship(
        back_populates="comments",
        sa_relationship_kwargs={"foreign_keys": "[Comment.user_id]"},
    )
