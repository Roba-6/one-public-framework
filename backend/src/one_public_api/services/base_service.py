from gettext import GNUTranslations
from typing import Annotated, Generic, List, Type, TypeVar
from uuid import UUID

from fastapi import status
from fastapi.params import Depends
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, SQLModel

from one_public_api.common.query_param import QueryParam
from one_public_api.core import get_session, get_translator, logger
from one_public_api.core.exceptions import APIError
from one_public_api.crud.data_creator import DataCreator
from one_public_api.crud.data_deleter import DataDeleter
from one_public_api.crud.data_reader import DataReader
from one_public_api.crud.data_updater import DataUpdater
from one_public_api.schemas.response_schema import MessageSchema

T = TypeVar("T", bound=SQLModel)


class BaseService(Generic[T]):
    """
    This base class is intended for service classes that implement business
    logic. It offers common functionalities such as data retrieval, creation,
    update, and deletion by using CRUD operation components.

    Attributes
    ----------
    search_columns : List[str]
        A list of column names to be used for search operations.
    model : Type[T]
        The model class representing the database table with which the service
        interacts.
    """

    search_columns: List[str] = []
    model: Type[T]

    def __init__(
        self,
        session: Annotated[Session, Depends(get_session)],
        translator: Annotated[GNUTranslations, Depends(get_translator)],
    ):
        self.session = session
        self._ = translator.gettext
        self.dr = DataReader(session)
        self.dc = DataCreator(session)
        self.du = DataUpdater(session)
        self.dd = DataDeleter(session)
        self.count: int = 0
        self.detail: List[MessageSchema] = []

    def get_all(self, query: QueryParam) -> List[T]:
        (data, self.count) = self.dr.all(self.model, query, self.search_columns)

        return data

    def add_one(self, data: T) -> T:
        result: T = self.dc.one(self.model, data.model_dump())
        self.session.commit()
        self.session.refresh(result)

        return result

    def get_one_by_id(self, target_id: UUID) -> T:
        return self.dr.get(self.model, target_id)

    def update_one(self, target_id: UUID, data: T) -> T:
        before: T = self.get_one_by_id(target_id)
        result: T = self.du.one(before, data.model_dump())

        self.session.commit()
        self.session.refresh(result)

        return result

    def delete_one(self, target_id: UUID) -> T:
        try:
            data: T = self.get_one_by_id(target_id)
            result: T = self.dd.one(data)

            self.session.commit()

            return result
        except IntegrityError as e:
            logger.error(e)
            raise APIError(
                status_code=status.HTTP_409_CONFLICT,
                code="E40900001",
                message=self._("This record might be referenced by other data."),
            )
