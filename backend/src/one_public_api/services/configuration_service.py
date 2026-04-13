from gettext import GNUTranslations
from typing import Annotated, List

from fastapi.params import Depends
from sqlmodel import Session

from one_public_api.common.query_param import QueryParam
from one_public_api.core import get_session
from one_public_api.core.i18n import get_translator
from one_public_api.models import Configuration
from one_public_api.services.base_service import BaseService


class ConfigurationService(BaseService[Configuration]):
    search_columns: List[str] = ["name", "key", "value"]
    model = Configuration

    def __init__(
        self,
        session: Annotated[Session, Depends(get_session)],
        translator: Annotated[GNUTranslations, Depends(get_translator)],
    ):
        super().__init__(session, translator)

    def get_all(self, query: QueryParam) -> List[Configuration]:
        (data, self.count) = self.dr.all(
            self.model, query, self.search_columns, {"requires_auth": False}
        )

        return data
