from uuid import UUID

from sqlmodel import Field

from one_public_api.core.settings import settings


class BelongToMixin:
    organization_id: UUID | None = Field(
        default=None,
        foreign_key=settings.DB_TABLE_PRE + "organizations.id",
        ondelete="RESTRICT",
    )
