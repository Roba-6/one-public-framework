from uuid import UUID, uuid4

from sqlmodel import Field

from one_public_api.core.i18n import translate as _


class IdMixin:
    """
    Mixin providing a unique identifier for data entities.

    Attributes
    ----------
    id : UUID
        The ID of the data, automatically generated as a version 4 UUID. It
        serves as the primary key for instances of the model.
    """

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        description=_("The ID of data."),
    )
