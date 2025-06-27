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
    parts = string.split("_")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])


def get_hashed_password(password: str) -> str:
    return CryptContext(schemes=["bcrypt"], deprecated="auto").hash(password)
