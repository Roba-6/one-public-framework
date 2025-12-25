from uuid import UUID

from sqlmodel import Field

from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings


class MaintenanceMixin:
    """
    Mixin class for maintaining information regarding creation and updates of
    database records.

    This mixin is designed to be used in ORM models to store metadata about who
    created or updated a specific record, providing auditing capabilities.

    Attributes
    ----------
    created_by : UUID or None
        The unique identifier of the user who created the record. This field
        may be None if the information is not available.
    updated_by : UUID or None
        The unique identifier of the user who last updated the record. This
        field may be None if the information is not available.
    """

    created_by: UUID | None = Field(
        default=None,
        foreign_key=settings.DB_TABLE_PRE + "users.id",
        ondelete="RESTRICT",
        title=_("Creator ID"),
        description=_("Creator ID Description"),
    )
    updated_by: UUID | None = Field(
        default=None,
        foreign_key=settings.DB_TABLE_PRE + "users.id",
        ondelete="RESTRICT",
        title=_("Updater ID"),
        description=_("Updater ID Description"),
    )
