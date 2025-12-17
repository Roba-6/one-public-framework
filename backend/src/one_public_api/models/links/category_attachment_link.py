from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.core.settings import settings


class CategoryAttachmentLink(SQLModel, table=True):
    __tablename__ = settings.DB_TABLE_PRE + "category_attachment_links"

    category_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "categories.id",
        primary_key=True,
    )
    attachment_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "attachments.id",
        primary_key=True,
    )
