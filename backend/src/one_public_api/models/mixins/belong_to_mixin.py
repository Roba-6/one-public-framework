from uuid import UUID

from sqlmodel import Field

from one_public_api.core.settings import settings


class BelongToMixin:
    """
    Mixin class for associating an object with an organization.

    This mixin provides a structure for linking objects to a specific organization
    using an optional foreign key. It can be used to enforce relationships between
    models and their associated organizations, typically in multi-tenant or similar
    systems.

    Attributes
    ----------
    organization_id : UUID or None
        Represents the unique identifier of the associated organization. It is an
        optional field that refers to the primary key of the organizations table,
        with restricted deletion behavior.
    """

    organization_id: UUID | None = Field(
        default=None,
        foreign_key=settings.DB_TABLE_PRE + "organizations.id",
        ondelete="RESTRICT",
    )
