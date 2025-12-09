from typing import Optional

from sqlmodel import Field

from one_public_api.core.i18n import translate as _
from one_public_api.schemas.user_schema import UserPublicResponse


class UserReferenceResponse:
    creator: Optional[UserPublicResponse] = Field(
        default=None,
        title=_("Creator"),
        description=_("Creator Description"),
    )
    updater: Optional[UserPublicResponse] = Field(
        default=None,
        title=_("Updater"),
        description=_("Updater Description"),
    )
