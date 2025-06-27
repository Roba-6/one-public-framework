from sqlmodel import Field

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _


class PasswordMixin:
    password: str = Field(
        default="",
        max_length=constants.MAX_LENGTH_64,
        description=_("The hashed password of the user."),
    )
