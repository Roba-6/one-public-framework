from typing import List

from passlib.context import CryptContext


def convert_text_logo(text: str, with_version: bool = True) -> str:
    """
    Converts a text representation of a logo based on a mapping system into a
    graphic-like string format.

    This function takes an input string composed of specific codes that represent
    various graphic characters and uses a mapping system to convert these codes
    into a logo-like visual representation. The output string can optionally
    include a version placeholder.

    Parameters
    ----------
    text : str
        A string representation of the logo code, where each two-character code
        represents a mapping from the `b` list to the `a` list. The first
        character of the code determines the character from `a` through its index
        in `b`, and the second character determines the repetition count.
    with_version : bool, optionally
        If True, appends a version placeholder to the resulting logo.

    Returns
    -------
    str
        The generated logo as a string based on the input code. Returns an empty
        string if the input contains invalid mappings.
    """

    b: List[str] = ["S", "U", "H", "P", "L", "B"]
    a: List[str] = [" ", "_", "-", "|", "/", "\\"]

    logo: str = ""

    try:
        for i in range(0, len(text), 2):
            tmp = text[i : i + 2]
            if tmp == "00":
                logo += "\n"
            else:
                logo += a[b.index(tmp[0])] * int(tmp[1])
    except ValueError:
        logo = ""

    if with_version:
        logo += " v%s"
    return logo


def to_camel(string: str) -> str:
    """
    Converts a given string in snake_case to camelCase.

    This function takes a string formatted in snake_case (words separated by
    underscores) and converts it to camelCase. The first word of the string is fully
    in lowercase, while later words are capitalized.

    Parameters
    ----------
    string : str
        The input string, formatted in snake_case.

    Returns
    -------
    str
        A converted string in camelCase.
        If the input string contains only underscores or is empty,
        the function returns an empty string. If the input string starts
        or ends with underscores, they are ignored during conversion.

    Examples
    --------
    >>> to_camel("hello_world")
    'helloWorld'
    >>> to_camel("convert_to_camel_case")
    'convertToCamelCase'
    >>> to_camel("_leading_underscore")
    'LeadingUnderscore'
    >>> to_camel("trailing_underscore_")
    'trailingUnderscore'
    >>> to_camel("__only__underscores__")
    'OnlyUnderscores'
    >>> to_camel("")
    ''
    >>> to_camel("alreadyCamelCase")
    'alreadycamelcase'
    """

    parts = string.split("_")
    return parts[0].lower() + "".join(word.capitalize() for word in parts[1:])


def get_hashed_password(password: str) -> str:
    return CryptContext(schemes=["bcrypt"], deprecated="auto").hash(password)
