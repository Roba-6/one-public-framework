from typing import Optional

from sqlmodel import Field

from one_public_api.core.i18n import translate as _
from one_public_api.schemas.user_schema import UserPublicResponse


class UserReferenceResponse:
    creator: Optional[UserPublicResponse] = Field(
        default=None,
        description=_("Creator"),
    )
    updater: Optional[UserPublicResponse] = Field(
        default=None,
        description=_("Updater"),
    )
