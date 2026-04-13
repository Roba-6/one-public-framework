from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.core.settings import settings


class PermissionActionLink(SQLModel, table=True):
    __tablename__ = settings.DB_TABLE_PRE + "permission_action_links"

    permission_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "permissions.id",
        primary_key=True,
    )
    action_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "actions.id",
        primary_key=True,
    )
