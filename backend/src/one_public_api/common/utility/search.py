from typing import Any, Dict, List, TypeVar

from sqlmodel import SQLModel

T = TypeVar("T", bound=SQLModel)


def find_in_model_list(target_list: List[T], key: str, value: Any) -> T | None:
    """
    Finds and returns the first item in a list of objects where a specified
    attribute matches a given value.

    This function iterates through a list of objects and compares the value of a
    specified attribute with the provided value. If a match is found, the function
    returns the corresponding object. If no match is found, it returns None.

    Parameters
    ----------
    target_list : List[T]
        A list of objects to be searched.
    key : str
        The attribute name to compare within each object in the list.
    value : Any
        The value to match against the specified attribute.

    Returns
    -------
    T | None
        The first object in the list that matches the specified attribute value,
        or None if
        no such object is found.
    """
    for item in target_list:
        if getattr(item, key) == value:
            return item
    else:
        return None


def add_maintenance(
    target_list: List[Dict[str, Any]], user: SQLModel
) -> List[Dict[str, Any]]:
    return [{**item, "creator": user, "updater": user} for item in target_list]


def add_updater(
    target_list: List[Dict[str, Any]], user: SQLModel
) -> List[Dict[str, Any]]:
    return [{**item, "updater": user} for item in target_list]


def convert_list_to_dict(target_list: List[T], key: str) -> Dict[str, T]:
    return {str(getattr(data, key)): data for data in target_list}
