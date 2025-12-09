from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.core.settings import settings


class RolePermissionLink(SQLModel, table=True):
    __tablename__ = settings.DB_TABLE_PRE + "role_permission_links"

    role_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "roles.id",
        primary_key=True,
    )
    permission_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "permissions.id",
        primary_key=True,
    )
