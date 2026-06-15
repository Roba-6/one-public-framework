from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.links import NotificationUserLink
from one_public_api.models.mixins import BelongToMixin, IdMixin, TimestampMixin
from one_public_api.models.mixins.maintenance_mixin import MaintenanceMixin

if TYPE_CHECKING:
    pass

NOTIFICATION_TITLE_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Notification title"),
    "description": _("Title of the notification."),
}

NOTIFICATION_CONTENT_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Notification content"),
    "description": _("Content of the notification."),
}

NOTIFICATION_PUBLISHED_AT_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Notification published time"),
    "description": _("Date and time when the notification is published."),
}

NOTIFICATION_IS_SCHEDULE_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Scheduled"),
    "description": _(
        "Indicates whether the notification is scheduled for publication."
    ),
}


class NotificationBase(SQLModel):
    title: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_1,
        **NOTIFICATION_TITLE_FIELD_KWARGS,
    )
    content: Optional[str] = Field(
        default=None,
        **NOTIFICATION_CONTENT_FIELD_KWARGS,
    )
    # 公開日時
    published_at: Optional[datetime] = Field(
        default=None,
        **NOTIFICATION_PUBLISHED_AT_FIELD_KWARGS,
    )


class NotificationOption(SQLModel):
    is_schedule: Optional[bool] = Field(
        default=None,
        **NOTIFICATION_IS_SCHEDULE_FIELD_KWARGS,
    )


class Notification(
    NotificationBase,
    NotificationOption,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    BelongToMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "notifications"

    title: str = Field(
        nullable=False,
        min_length=constants.LENGTH_1,
        **NOTIFICATION_TITLE_FIELD_KWARGS,
    )
    is_schedule: bool = Field(
        default=False,
        nullable=False,
        **NOTIFICATION_IS_SCHEDULE_FIELD_KWARGS,
    )

    user_links: List["NotificationUserLink"] = Relationship(
        back_populates="notification"
    )
