from typing import Annotated, Any, Dict, TypeVar

from fastapi.params import Depends
from sqlmodel import Session, SQLModel

from one_public_api.core import get_session
from one_public_api.crud.data_reader import DataReader

T = TypeVar("T", bound=SQLModel)


class DataUpdater:
    """
    Handles updating data in a database session.

    Attributes
    ----------
    session : Session
        Database session instance used to manage and persist data transactions.
    dr : DataReader
        An instance of the DataReader class, initialized with the provided database
        session, and used to perform data reading operations.
    """

    def __init__(self, session: Annotated[Session, Depends(get_session)]):
        self.session = session
        self.dr = DataReader(session)

    def one(
        self,
        before: T,
        after: Dict[str, Any] | None = None,
    ) -> T:
        if after is not None:
            for k in after.keys():
                if k == "id":
                    continue
                if after[k] is not None:
                    setattr(before, k, after[k])
        self.session.add(before)
        self.session.flush()

        return before
