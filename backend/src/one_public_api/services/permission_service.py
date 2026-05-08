from gettext import GNUTranslations
from typing import Annotated, Any, List, Sequence, Type
from uuid import UUID

from fastapi.params import Depends
from sqlmodel import Session

from one_public_api.core import get_session
from one_public_api.core.i18n import get_translator
from one_public_api.models import Permission
from one_public_api.models.links import PermissionActionLink, PermissionFeatureLink
from one_public_api.services.base_service import BaseService


class PermissionService(BaseService[Permission]):
    search_columns: List[str] = ["name"]
    model = Permission

    def __init__(
        self,
        session: Annotated[Session, Depends(get_session)],
        translator: Annotated[GNUTranslations, Depends(get_translator)],
    ):
        super().__init__(session, translator)

    def add_one(self, data: Any) -> Permission:
        result: Permission = super().add_one(Permission(**data.model_dump()))
        fields_set: set[str] = getattr(data, "model_fields_set", set())
        if "action_ids" in fields_set:
            self._replace_links(
                PermissionActionLink, result.id, "action_id", data.action_ids
            )
        if "feature_ids" in fields_set:
            self._replace_links(
                PermissionFeatureLink, result.id, "feature_id", data.feature_ids
            )

        self.session.commit()
        self.session.refresh(result)

        return result

    def update_one_by_id(self, target_id: UUID, data: Any) -> Permission:
        before: Permission = self.get_one_by_id(target_id)
        result: Permission = self.du.one(
            before,
            data.model_dump(
                exclude={"action_ids", "feature_ids"},
                exclude_unset=True,
            ),
        )

        fields_set: set[str] = getattr(data, "model_fields_set", set())
        if "action_ids" in fields_set:
            self._replace_links(
                PermissionActionLink, target_id, "action_id", data.action_ids
            )
        if "feature_ids" in fields_set:
            self._replace_links(
                PermissionFeatureLink, target_id, "feature_id", data.feature_ids
            )

        self.session.commit()
        self.session.refresh(result)

        return result

    def _replace_links(
        self,
        link_model: Type[PermissionActionLink | PermissionFeatureLink],
        permission_id: UUID,
        id_name: str,
        ids: Sequence[str | UUID],
    ) -> None:
        links, count = self.dr.all(
            link_model, conditions={"permission_id": permission_id}
        )
        self.dd.all(links)
        self.dc.all(
            link_model,
            [
                {"permission_id": permission_id, f"{id_name}": action_id}
                for action_id in ids
            ],
        )
