from typing import TYPE_CHECKING, Any, Dict
from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.mixins import IdMixin, TimestampMixin
from one_public_api.models.mixins.maintenance_mixin import MaintenanceMixin

if TYPE_CHECKING:
    from one_public_api.models.system.user_model import User

COMMENT_CONTENT_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_1000,
    "title": _("Comment content"),
    "description": _("Content of the comment."),
}

COMMENT_USER_ID_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Comment owner"),
    "description": _("Owner of the comment."),
}


class CommentBase(SQLModel):
    content: str = Field(
        nullable=False,
        min_length=constants.LENGTH_1,
        **COMMENT_CONTENT_FIELD_KWARGS,
    )

    user_id: UUID = Field(
        default=None,
        nullable=True,
        foreign_key=settings.DB_TABLE_PRE + "users.id",
        ondelete="CASCADE",
        **COMMENT_USER_ID_FIELD_KWARGS,
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
