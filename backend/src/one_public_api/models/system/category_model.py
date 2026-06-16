from typing import TYPE_CHECKING, Any, Dict, Optional
from uuid import UUID

from sqlmodel import JSON, Column, Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.mixins import IdMixin, MaintenanceMixin, TimestampMixin

if TYPE_CHECKING:
    from one_public_api.models import User

CATEGORY_NAME_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Category name"),
    "description": _("Display name of the category."),
}

CATEGORY_ALIAS_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Category alias"),
    "description": _("Alternative identifier used to reference the category."),
}

CATEGORY_VALUE_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Category value"),
    "description": _("Value associated with the category."),
}

CATEGORY_DESCRIPTION_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_1000,
    "title": _("Description"),
    "description": _("Detailed description of the category."),
}

CATEGORY_ID_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Category ID"),
    "description": _("ID of the associated category."),
}

CATEGORY_OPTIONS_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Configuration options"),
    "description": _("Optional settings associated with the category."),
}

CATEGORY_IS_ENABLED_FIELD_KWARGS: Dict[str, Any] = {
    "title": _("Enabled"),
    "description": _("Indicates whether the category is active and can be used."),
}


class CategoryBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        **CATEGORY_NAME_FIELD_KWARGS,
    )
    alias: Optional[str] = Field(
        default=None,
        unique=True,
        **CATEGORY_ALIAS_FIELD_KWARGS,
    )
    value: Optional[str] = Field(
        default=None,
        unique=True,
        **CATEGORY_VALUE_FIELD_KWARGS,
    )
    description: Optional[str] = Field(
        default=None,
        **CATEGORY_DESCRIPTION_FIELD_KWARGS,
    )


class CategoryOption(SQLModel):
    options: Optional[Dict[str, Any]] = Field(
        default=None,
        sa_column=Column(JSON),
        **CATEGORY_OPTIONS_FIELD_KWARGS,
    )


class CategoryStatus(SQLModel):
    is_enabled: Optional[bool] = Field(
        default=None,
        **CATEGORY_IS_ENABLED_FIELD_KWARGS,
    )


class CategoryForeignKey(SQLModel):
    category_id: UUID | None = Field(
        default=None,
        foreign_key=settings.DB_TABLE_PRE + "categories.id",
        ondelete="RESTRICT",
        **CATEGORY_ID_FIELD_KWARGS,
    )


class Category(
    CategoryBase,
    CategoryOption,
    CategoryStatus,
    CategoryForeignKey,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "categories"

    name: str = Field(
        nullable=False,
        **CATEGORY_NAME_FIELD_KWARGS,
    )
    parent: Optional["Category"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Category.category_id]",
            "primaryjoin": "Category.category_id==Category.id",
            "remote_side": "[Category.id]",
        }
    )
    options: Dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSON),
        **CATEGORY_OPTIONS_FIELD_KWARGS,
    )
    is_enabled: bool = Field(
        default=True,
        nullable=False,
        **CATEGORY_IS_ENABLED_FIELD_KWARGS,
    )

    creator: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Category.created_by]",
            "primaryjoin": "Category.created_by==User.id",
            "remote_side": "[User.id]",
        }
    )
    updater: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Category.updated_by]",
            "primaryjoin": "Category.updated_by==User.id",
            "remote_side": "[User.id]",
        }
    )
