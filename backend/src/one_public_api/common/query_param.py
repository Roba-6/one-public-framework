from typing import List

from pydantic import BaseModel, ConfigDict, Field

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core.i18n import translate as _


class QueryParam(BaseModel):
    """
    Represents query parameters for database queries.

    This class is used to encapsulate query parameters such as pagination settings,
    sorting, and keyword filtering. It ensures that the provided parameters adhere
    to specified constraints and formats.

    Attributes
    ----------
    offset : int
        The offset from where to start fetching results. Must be greater than or
        equal to 0. Default is 0.
    limit : int
        The maximum number of results to fetch. Must be greater than 0 and less
        than or equal to the defined maximum limit (constants.DB_MAX_LIMIT). Default
        is constants.DB_DEFAULT_LIMIT.
    order_by : List[str]
        A list of fields to order the query results by. Default is an empty list.
    keywords : List[str]
        A list of keywords for filtering query results. Default is an empty list.
    """

    offset: int = Field(
        default=0,
        ge=0,
        description=_("Offset from where to start"),
    )
    limit: int = Field(
        default=constants.DB_DEFAULT_LIMIT,
        gt=0,
        le=constants.DB_MAX_LIMIT,
        description=_("Limit"),
    )
    order_by: List[str] = Field(default=[], description=_("Order by"))
    keywords: List[str] = Field(default=[], description=_("Keywords"))
    # filtering: Dict[str, Any] = Field()

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        extra="forbid",
    )
