from datetime import datetime

from sqlmodel import Field

from one_public_api.core.i18n import translate as _


class TimestampMixin:
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
        default_factory=datetime.now,
        nullable=False,
        title=_("Record creation time"),
        description=_("Record creation time Description"),
    )
    updated_at: datetime = Field(
        default_factory=datetime.now,
        nullable=False,
        sa_column_kwargs={"onupdate": datetime.now},
        title=_("Last update time"),
        description=_("Last update time Description"),
    )
