from typing import Optional

from sqlmodel import Field, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.mixins import (
    BelongToMixin,
    IdMixin,
    MaintenanceMixin,
    TimestampMixin,
)


class RoleBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.MAX_LENGTH_1,
        max_length=constants.MAX_LENGTH_100,
        description=_("Role name"),
    )
    description: Optional[str] = Field(
        default=None,
        max_length=constants.MAX_LENGTH_1000,
        description=_("Description"),
    )


class Role(
    RoleBase,
    BelongToMixin,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "roles"
