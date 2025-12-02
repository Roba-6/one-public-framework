from uuid import UUID

from sqlmodel import Field, SQLModel

from one_public_api.common import constants


class UserConfigurationLink(SQLModel, table=True):
    __tablename__ = constants.DB_PREFIX_SYS + "user_configuration_link"

    user_id: UUID = Field(
        nullable=False,
        foreign_key=constants.DB_PREFIX_SYS + "users.id",
        primary_key=True,
    )
    configuration_id: UUID = Field(
        nullable=False,
        foreign_key=constants.DB_PREFIX_SYS + "configurations.id",
        primary_key=True,
    )
