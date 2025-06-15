from typing import Annotated, Any, Callable, Dict, List, Type, TypeVar

from fastapi.params import Depends
from sqlmodel import Session, SQLModel

from one_public_api.core import get_session
from one_public_api.crud.data_reader import DataReader

T = TypeVar("T", bound=SQLModel)


class DataCreator:
    """
    Provides functionality to create and persist single or multiple instances
    of a model to a database session.

    Attributes
    ----------
    session : Session
        The database session used for persisting objects.
    """

    def __init__(self, session: Annotated[Session, Depends(get_session)]):
        self.session = session
        self.dr = DataReader(session)

    def one(
        self,
        model: Callable[..., T],
        data: Dict[str, Any],
    ) -> T:
        """
        Adds a new instance of the specified model to the database session,
        with attributes provided in the data dictionary. After adding the
        instance, the session is flushed to synchronize with the database.

        Parameters
        ----------
        model : Callable[..., T]
            The model class to be instantiated and added to the database session.
        data : Dict[str, Any]
            A dictionary containing the data attributes for the model instance.

        Returns
        -------
        T
            The newly created and added instance of the specified model.
        """
        result: T = model(**data)
        self.session.add(result)
        self.session.flush()

        return result

    def all(
        self,
        model: Callable[..., T],
        data: List[Dict[str, Any]],
    ) -> List[T]:
        """
        Creates and flushes a list of model instances to the database session.

        This function constructs instances of the specified model from the provided
        data, adds them to the current database session in a batch, and flushes the
        session to persist the changes. The input data should be a list of dictionaries,
        where each dictionary represents the attributes of a model instance. The
        function
        returns the list of created model instances.

        Parameters
        ----------
        model : Callable[..., T]
            The model class to be used for creating instances. It should be a class that
            supports instantiation with keyword arguments corresponding to the keys in
            the input dictionaries.
        data : List[Dict[str, Any]]
            A list of dictionaries where each dictionary contains the data required to
            instantiate a model object. Each key-value pair corresponds to an attribute
            of the model.

        Returns
        -------
        List[T]
            A list of created model objects after being added to the session. Each
            object is an instance of the provided model populated with the data from
            the input dictionaries.
        """

        results: List[T] = [model(**d) for d in data]
        self.session.add_all(results)
        self.session.flush()

        return results

    def all_if_not_exists(
        self,
        model: Type[T],
        data: List[Dict[str, Any]],
    ) -> List[T]:
        results: List[T] = []
        for d in data:
            if self.dr.search(model, d)[1] == 0:
                results.append(model(**d))
        self.session.add_all(results)
        self.session.flush()

        return results
