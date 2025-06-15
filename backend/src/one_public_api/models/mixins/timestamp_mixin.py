from datetime import datetime

from sqlmodel import Field

from one_public_api.core.i18n import translate as _


class TimestampMixin:
    created_at: datetime = Field(
        default_factory=datetime.now,
        description=_("Timestamp indicating when the record was created."),
    )

    updated_at: datetime = Field(
        default_factory=datetime.now,
        description=_("Timestamp indicating when the record was last updated."),
        sa_column_kwargs={"onupdate": datetime.now},
    )
