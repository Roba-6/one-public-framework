from gettext import GNUTranslations
from typing import Annotated, List

from fastapi.params import Depends
from sqlmodel import Session

from one_public_api.common.utility.str import get_hashed_password
from one_public_api.core import get_session
from one_public_api.core.exceptions import DataError
from one_public_api.core.i18n import get_translator
from one_public_api.models import User
from one_public_api.schemas import UserCreateRequest
from one_public_api.services.base_service import BaseService


class UserService(BaseService[User]):
    search_columns: List[str] = ["name", "firstname", "lastname", "nickname", "email"]
    model = User

    def __init__(
        self,
        session: Annotated[Session, Depends(get_session)],
        translator: Annotated[GNUTranslations, Depends(get_translator)],
    ):
        super().__init__(session, translator)

    def add_user(self, data: UserCreateRequest, current_user: User) -> User:
        ins_data = User(**data.model_dump())
        try:
            ins_data.hashed_password = get_hashed_password(str(data.password))
            ins_data.created_by = current_user.id
            ins_data.updated_by = current_user.id

            return super().add_one(ins_data)
        except DataError:
            raise DataError(
                self._("Data already exists."), ins_data.model_dump_json(), "E4090003"
            )
