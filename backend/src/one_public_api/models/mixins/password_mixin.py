from typing import Any, Dict, Optional

from sqlmodel import Field, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _

HASHED_PASSWORD_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_128,
    "title": _("Password"),
    "description": _("Hashed password used for authentication."),
}


class PasswordMixin(SQLModel):
    """
    Mixin class for handling password-related functionality.

    This class provides a structure to include and define user passwords
    with specific constraints. It is designed to store the password attribute
    with validation for the maximum allowed length.

    Attributes
    ----------
    hashed_password : Optional[str]
        Password provided by the user.
    """

    hashed_password: Optional[str] = Field(
        default=None,
        nullable=True,
        **HASHED_PASSWORD_FIELD_KWARGS,
    )
