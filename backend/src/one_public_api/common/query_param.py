from typing import List

from pydantic import BaseModel, ConfigDict, Field

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _


class QueryParam(BaseModel):
    """
    QueryParam class.

    Represents query parameters for database-related operations with functionality to
    customize offset, limit, ordering, filtering, and additional keywords. This class
    enforces constraints on provided values and ensures data is validated based on
    specified rules. It is used to control data retrieval for operations such as
    pagination, sorting, and dynamic filtering.

    Attributes
    ----------
    offset : int
        Offset from where to start. Must be greater than or equal to 0.
    limit : int
        Limit of items to retrieve. Must be greater than 0 and less than or equal to
        the maximum allowable value defined in constants.
    order_by : List[str]
        Specifies fields to order results by with a default of an empty list.
    keywords : List[str]
        List of keywords to be used for filtering or search.
    """

    offset: int = Field(
        default=0,
        ge=0,
        title=_("Offset"),
        description=_("Offset Description"),
    )
    limit: int = Field(
        default=constants.DB_DEFAULT_LIMIT,
        gt=0,
        le=constants.DB_MAX_LIMIT,
        title=_("Limit"),
        description=_("Limit Description"),
    )
    order_by: List[str] = Field(
        default=[],
        title=_("Order by"),
        description=_("Order by Description"),
    )
    keywords: List[str] = Field(
        default=[],
        title=_("Keywords"),
        description=_("Keywords Description"),
    )
    # filtering: Dict[str, Any] = Field()

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        extra="forbid",
    )
