from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings


class NotificationUserLink(SQLModel, table=True):
    __tablename__ = settings.DB_TABLE_PRE + "notification_user_links"

    notification_id: UUID = Field(
        foreign_key=settings.DB_TABLE_PRE + "notifications.id",
        primary_key=True,
    )
    user_id: UUID = Field(
        foreign_key=settings.DB_TABLE_PRE + "users.id",
        primary_key=True,
    )
    is_read: bool = Field(
        default=False,
        title=_("Is Read Flag"),
        description=_("Is Read Flag Description"),
    )
