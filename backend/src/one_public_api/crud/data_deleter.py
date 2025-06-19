from typing import Annotated, TypeVar

from fastapi.params import Depends
from sqlmodel import Session, SQLModel

from one_public_api.core import get_session

T = TypeVar("T", bound=SQLModel)


class DataDeleter:
    """
    Handles deletion of data using a provided database session.

    Attributes
    ----------
    session : Session
        Database session used for performing deletion operations.
    """

    def __init__(self, session: Annotated[Session, Depends(get_session)]):
        self.session = session

    def one(self, data: T) -> T:
        """
        Delete a single record from the provided data.

        Parameters
        ----------
        data : T
            The object to be deleted from the session.

        Returns
        -------
        T
            The same object that was provided, after it has been marked for deletion.
        """

        self.session.delete(data)
        self.session.flush()

        return data
