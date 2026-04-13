from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.core.settings import settings


class RoleUserLink(SQLModel, table=True):
    __tablename__ = settings.DB_TABLE_PRE + "role_user_links"

    role_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "roles.id",
        primary_key=True,
    )
    user_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "users.id",
        primary_key=True,
    )
