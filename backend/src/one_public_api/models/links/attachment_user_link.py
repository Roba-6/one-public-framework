from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.core.settings import settings


class AttachmentUserLink(SQLModel, table=True):
    __tablename__ = settings.DB_TABLE_PRE + "attachment_user_links"

    attachment_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "attachments.id",
        primary_key=True,
    )
    user_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "users.id",
        primary_key=True,
    )
