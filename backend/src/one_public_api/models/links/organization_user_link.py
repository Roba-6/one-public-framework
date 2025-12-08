from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.core.settings import settings


class OrganizationUserLink(SQLModel, table=True):
    __tablename__ = settings.DB_TABLE_PRE + "organization_user_links"

    organization_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "organizations.id",
        primary_key=True,
    )
    user_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "users.id",
        primary_key=True,
    )
