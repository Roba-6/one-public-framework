from typing import Optional

from sqlmodel import Field

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _


class AddressMixin:
    postal_code: Optional[str] = Field(
        default=None,
        min_length=constants.LENGTH_3,
        max_length=constants.LENGTH_10,
        description=_("Postal Code"),
    )
    address_country: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_100,
        description=_("Country"),
    )
    address_prefecture: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_100,
        description=_("Prefecture"),
    )
    address_municipality: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_100,
        description=_("Municipality"),
    )
    address_detail_1: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_100,
        description=_("Address Detail 1"),
    )
    address_detail_2: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_500,
        description=_("Address Detail 2"),
    )
    tel: Optional[str] = Field(
        default=None,
        max_length=constants.LENGTH_20,
        description=_("Telephone Number"),
    )
