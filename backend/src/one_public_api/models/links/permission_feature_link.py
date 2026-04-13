from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.core.settings import settings


class PermissionFeatureLink(SQLModel, table=True):
    __tablename__ = settings.DB_TABLE_PRE + "permission_feature_links"

    permission_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "permissions.id",
        primary_key=True,
    )
    feature_id: UUID = Field(
        nullable=False,
        foreign_key=settings.DB_TABLE_PRE + "features.id",
        primary_key=True,
    )
