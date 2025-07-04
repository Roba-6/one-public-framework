import os


def is_path_exists(path: str) -> bool:
    """
    Checks the existence of a specified file system path.

    This function determines whether a given file system path exists. It leverages
    the `os.path.exists` method to perform this check. The function returns a
    boolean value indicating the presence or absence of the specified path.

    Parameters
    ----------
    path : str
        The file system path to be checked for existence.

    Returns
    -------
    bool
        True if the specified path exists, otherwise False.
    """

    return os.path.exists(path)
