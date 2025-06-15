from uuid import UUID

from sqlmodel import Field

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _


class MaintenanceMixin:
    created_by: UUID | None = Field(
        default=None,
        foreign_key=constants.DB_PREFIX_SYS + "users.id",
        ondelete="RESTRICT",
        description=_("The ID of the user who created the record."),
    )
    updated_by: UUID | None = Field(
        default=None,
        foreign_key=constants.DB_PREFIX_SYS + "users.id",
        ondelete="RESTRICT",
        description=_("The ID of the user who last updated the record."),
    )
