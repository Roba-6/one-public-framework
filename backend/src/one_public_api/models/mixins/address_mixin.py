from typing import Any, Dict, Optional

from sqlmodel import Field, SQLModel

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _

POSTAL_CODE_FIELD_KWARGS: Dict[str, Any] = {
    "min_length": constants.LENGTH_3,
    "max_length": constants.LENGTH_10,
    "title": _("Postal Code"),
    "description": _("Postal code used for the address."),
}
ADDRESS_COUNTRY_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Country"),
    "description": _("Country name of the address."),
}
ADDRESS_PREFECTURE_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Prefecture"),
    "description": _("Prefecture or state of the address."),
}
ADDRESS_MUNICIPALITY_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Municipality"),
    "description": _("City, ward, or municipality of the address."),
}
ADDRESS_DETAIL_1_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_100,
    "title": _("Address Detail 1"),
    "description": _("Primary street address information."),
}
ADDRESS_DETAIL_2_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_500,
    "title": _("Address Detail 2"),
    "description": _(
        "Additional address information such as building name or room number."
    ),
}
TEL_FIELD_KWARGS: Dict[str, Any] = {
    "max_length": constants.LENGTH_20,
    "title": _("Telephone Number"),
    "description": _("Contact telephone number."),
}


class AddressMixin(SQLModel):
    """
    Provides a mixin for managing address-related attributes.

    This class defines optional attributes for capturing detailed address
    information, including postal codes, country, prefecture, municipality,
    address details, and telephone numbers. It is designed to be incorporated
    into other classes requiring the storage and handling of comprehensive
    address data.

    Attributes
    ----------
    postal_code : Optional[str]
        The postal code, with length constraints based on the defined constants.
    address_country : Optional[str]
        The country associated with the address, with a maximum length defined
        by the constant LENGTH_100.
    address_prefecture : Optional[str]
        The prefecture or state of the address, constrained to a maximum length
        of LENGTH_100.
    address_municipality : Optional[str]
        The municipality or city of the address, with a maximum length defined
        by LENGTH_100.
    address_detail_1 : Optional[str]
        Additional detailed address information, constrained to a maximum
        length of LENGTH_100.
    address_detail_2 : Optional[str]
        Further detailed address information, with a maximum length defined
        by LENGTH_500.
    tel : Optional[str]
        The telephone number associated with the address, constrained to a
        maximum length of LENGTH_20.
    """

    postal_code: Optional[str] = Field(
        default=None,
        **POSTAL_CODE_FIELD_KWARGS,
    )
    address_country: Optional[str] = Field(
        default=None,
        **ADDRESS_COUNTRY_FIELD_KWARGS,
    )
    address_prefecture: Optional[str] = Field(
        default=None,
        **ADDRESS_PREFECTURE_FIELD_KWARGS,
    )
    address_municipality: Optional[str] = Field(
        default=None,
        **ADDRESS_MUNICIPALITY_FIELD_KWARGS,
    )
    address_detail_1: Optional[str] = Field(
        default=None,
        **ADDRESS_DETAIL_1_FIELD_KWARGS,
    )
    address_detail_2: Optional[str] = Field(
        default=None,
        **ADDRESS_DETAIL_2_FIELD_KWARGS,
    )
    tel: Optional[str] = Field(
        default=None,
        **TEL_FIELD_KWARGS,
    )
