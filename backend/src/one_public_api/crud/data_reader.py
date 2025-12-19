from typing import Annotated, Any, Dict, List, Tuple, Type, TypeVar
from uuid import UUID

from fastapi.params import Depends
from sqlalchemy import JSON, cast, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.exc import NoResultFound

# from sqlalchemy.inspection import inspect
from sqlmodel import Session, SQLModel, col, or_, select

from one_public_api.common.query_param import QueryParam
from one_public_api.core import get_session

T = TypeVar("T", bound=SQLModel)


class DataReader:
    """
    Provides functionality for interacting with a database to retrieve and
    query data based on defined models and query parameters.

    Attributes
    ----------
    session : Session
        The SQLAlchemy session used for executing database queries.
    """

    def __init__(self, session: Annotated[Session, Depends(get_session)]):
        self.session = session

    def get(self, model: Type[T], target_id: UUID) -> T:
        statement: Any = select(model)
        statement = statement.where(getattr(model, "id") == target_id)
        result: T | None = self.session.exec(statement).one_or_none()
        if result is None:
            raise NoResultFound()

        return result

    def one(self, model: Type[T], conditions: Dict[str, Any]) -> T:
        statement: Any = select(model)
        for k, v in conditions.items():
            statement = statement.where(getattr(model, k) == v)
        result: T | None = self.session.exec(statement).one_or_none()
        if result is None:
            raise NoResultFound()

        return result

    def all(
        self,
        model: Type[T],
        query: QueryParam | None = None,
        search_target: List[str] | None = None,
        conditions: Dict[str, Any] | None = None,
    ) -> Tuple[List[T], int]:
        statement: Any = select(model)
        count_statement: Any = select(func.count()).select_from(model)
        if (
            query
            and query.keywords is not None
            and len(query.keywords) > 0
            and search_target is not None
            and len(search_target) > 0
        ):
            kw_col_list: List[Any] = []
            for column in search_target:
                for keyword in query.keywords:
                    kw_col_list.append(col(getattr(model, column)).like(f"%{keyword}%"))
            statement = statement.where(or_(*kw_col_list))
            count_statement = count_statement.where(or_(*kw_col_list))
        if conditions is not None and len(conditions) > 0:
            for k, v in conditions.items():
                if isinstance(v, list):
                    statement = statement.where(col(getattr(model, k)).in_(v))
                    count_statement = count_statement.where(
                        col(getattr(model, k)).in_(v)
                    )
                else:
                    statement = statement.where(getattr(model, k) == v)
                    count_statement = count_statement.where(getattr(model, k) == v)
        if query and query.offset is not None:
            statement = statement.offset(query.offset)
        if query and query.limit is not None:
            statement = statement.limit(query.limit)
        if query and query.order_by is not None and len(query.order_by) > 0:
            ob_col_list: List[Any] = []
            for column in query.order_by:
                if column.endswith("_desc"):
                    ob_col_list.append(col(getattr(model, column[:-5])).desc())
                else:
                    ob_col_list.append(col(getattr(model, column)))
            statement = statement.order_by(*ob_col_list)

        results: List[T] = list(self.session.exec(statement).all())
        count: int = self.session.exec(count_statement).one()

        return results, count

    def search(
        self,
        model: Type[T],
        conditions: Dict[str, Any],
    ) -> Tuple[List[T], int]:
        statement: Any = select(model)
        count_statement: Any = select(func.count()).select_from(model)
        for k, v in conditions.items():
            # inspect(model)
            if getattr(model, k) and isinstance(
                getattr(getattr(model, k), "type", None), JSON
            ):
                cond = cast(getattr(model, k), JSONB) == cast(v, JSONB)
            else:
                cond = getattr(model, k) == v
            statement = statement.where(cond)
            count_statement = count_statement.where(cond)

        results: List[T] = list(self.session.exec(statement).all())
        count: int = self.session.exec(count_statement).one()

        return results, count
