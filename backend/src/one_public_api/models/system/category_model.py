from typing import TYPE_CHECKING, Any, Dict, Optional

from sqlmodel import JSON, Column, Field, Relationship, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models.mixins import IdMixin, MaintenanceMixin, TimestampMixin

if TYPE_CHECKING:
    from one_public_api.models import User


class CategoryBase(SQLModel):
    name: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_1,
        max_length=constants.LENGTH_100,
        description=_("Category name"),
    )
    alias: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_100,
        description=_("Category alias"),
    )
    value: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_500,
        description=_("Category value"),
    )
    description: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_1000,
        description=_("Description"),
    )


class CategoryOption(SQLModel):
    options: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        sa_column=Column(JSON),
        description=_("Configuration options"),
    )
    is_enabled: Optional[bool] = Field(
        default=None,
        description=_("Whether the organization is enabled"),
    )


class Category(
    CategoryBase,
    CategoryOption,
    TimestampMixin,
    MaintenanceMixin,
    IdMixin,
    table=True,
):
    __tablename__ = settings.DB_TABLE_PRE + "categories"

    name: str = Field(
        nullable=False,
        min_length=constants.LENGTH_1,
        max_length=constants.LENGTH_100,
        description=_("Category name"),
    )
    is_enabled: bool = Field(
        default=True,
        nullable=False,
        description=_("Whether the organization is enabled"),
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
