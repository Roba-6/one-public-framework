from gettext import GNUTranslations
from typing import Annotated, List

from fastapi.params import Depends
from sqlmodel import Session

from one_public_api.common.query_param import QueryParam
from one_public_api.core import get_session
from one_public_api.core.i18n import get_translator
from one_public_api.models import Feature
from one_public_api.services.base_service import BaseService


class FeatureService(BaseService[Feature]):
    search_columns: List[str] = ["name"]
    model = Feature

    def __init__(
        self,
        session: Annotated[Session, Depends(get_session)],
        translator: Annotated[GNUTranslations, Depends(get_translator)],
    ):
        super().__init__(session, translator)

    def get_all_public(self, query: QueryParam) -> List[Feature]:
        (data, self.count) = self.dr.all(
            self.model, query, self.search_columns, {"is_enabled": True}
        )

        return data
