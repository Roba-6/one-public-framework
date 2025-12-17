from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.links import NotificationUserLink
from one_public_api.models.mixins import BelongToMixin, IdMixin, TimestampMixin
from one_public_api.models.mixins.maintenance_mixin import MaintenanceMixin

if TYPE_CHECKING:
    from one_public_api.models.system.user_model import User


class NotificationBase(SQLModel):
    title: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_1,
        max_length=constants.LENGTH_100,
        description=_("Notification Title"),
    )
    content: Optional[str] = Field(
        default=None,
        description=_("Notification Content"),
    )
    # 公開日時
    published_at: Optional[datetime] = Field(
        default=None,
        description=_("Notification Published Time"),
    )


class NotificationOption(SQLModel):
    is_schedule: Optional[bool] = Field(
        default=None,
        description=_("Is Scheduled"),
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
        max_length=constants.LENGTH_100,
        description=_("Notification Title"),
    )
    is_schedule: bool = Field(
        default=False,
        nullable=False,
        description=_("Is Scheduled"),
    )

    users: List["User"] = Relationship(
        back_populates="notifications", link_model=NotificationUserLink
    )
