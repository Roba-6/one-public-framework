from uuid import UUID, uuid4

from sqlmodel import Field

from one_public_api.core.i18n import translate as _


class IdMixin:
    """
    Mixin class for providing an auto-generated unique identifier to records.

    This class is designed as a mixin to be inherited by other classes. Its purpose
    is to automatically assign a universally unique identifier (UUID) as the
    primary key for the associated record. This ensures that each record has a
    unique and immutable identifier.

    Attributes
    ----------
    id : UUID
        Auto-generated unique ID for the record, used as the primary key.
    """

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        title=_("Record ID"),
        description=_("Auto-generated unique ID for the record"),
    )
