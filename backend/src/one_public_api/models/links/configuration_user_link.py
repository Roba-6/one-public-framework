from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.core.settings import settings


class ConfigurationUserLink(SQLModel, table=True):
    __tablename__ = settings.DB_TABLE_PRE + "configuration_user_links"

    configuration_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "configurations.id",
        primary_key=True,
    )
    user_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "users.id",
        primary_key=True,
    )
