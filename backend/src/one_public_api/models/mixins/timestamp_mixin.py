from datetime import UTC, datetime
from typing import Any, Dict

from sqlmodel import Field, SQLModel

from one_public_api.core.i18n import translate as _

CREATED_AT_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Record creation time"),
    "description": _("Date and time when the record was created."),
}
UPDATED_AT_FIELD_KWARGS: Dict[str, Any] = {
    "sa_column_kwargs": {"onupdate": datetime.now},
    "title": _("Last update time"),
    "description": _("Date and time when the record was last updated."),
}


class TimestampMixin(SQLModel):
    """
    Mixin class to add timestamp functionality for creation and modification.

    This class includes attributes for capturing the record creation time and
    the last updated time. The `created_at` attribute is automatically initialized
    to the current datetime when the object is created. The `updated_at` attribute
    is automatically updated to the current datetime whenever a modification occurs.

    Attributes
    ----------
    created_at : datetime
        Record creation time.
    updated_at : datetime
        Last update time (auto-updated on modification).
    """

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
        **CREATED_AT_FIELD_KWARGS,
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
        **UPDATED_AT_FIELD_KWARGS,
    )
