from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.core.settings import settings


class ConfigurationOrganizationLink(SQLModel, table=True):
    __tablename__ = settings.DB_TABLE_PRE + "configuration_organization_links"

    configuration_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "configurations.id",
        primary_key=True,
    )
    organization_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "organizations.id",
        primary_key=True,
    )
