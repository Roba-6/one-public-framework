from typing import Any, Dict, Optional

from sqlmodel import Field

from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _
from one_public_api.models.mixins.id_mixin import IdMixin
from one_public_api.models.system.comment_model import CommentBase
from one_public_api.schemas import UserPublicResponse, example_user_base
from one_public_api.schemas.response_schema import example_id

example_base: Dict[str, Any] = {
    "content": "SYS-COF-P-LST",
    "user": example_user_base,
}

# ----- Public Schemas -----------------------------------------------------------------


class CommentPublicResponse(CommentBase, IdMixin):
    user: Optional[UserPublicResponse] = Field(
        default=None,
        title=_("User"),
        description=_("User Description"),
    )

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [{**example_base, **example_id}],
        },
    }
