import os
from datetime import datetime
from gettext import GNUTranslations
from typing import Annotated, List
from uuid import UUID

from fastapi import UploadFile
from fastapi.params import Depends
from sqlmodel import Session

from one_public_api.common import constants
from one_public_api.common.managements.file_manager import FileManager
from one_public_api.common.utility.files import remove_file
from one_public_api.core import get_session
from one_public_api.core.i18n import get_translator
from one_public_api.models import Attachment, User
from one_public_api.services.base_service import BaseService


class AttachmentService(BaseService[Attachment]):
    search_columns: List[str] = ["name", "original_name", "description"]
    model = Attachment

    def __init__(
        self,
        session: Annotated[Session, Depends(get_session)],
        translator: Annotated[GNUTranslations, Depends(get_translator)],
    ):
        super().__init__(session, translator)

    def delete_one_by_id(self, target_id: UUID) -> Attachment:
        rst: Attachment = super().delete_one_by_id(target_id)
        if rst.path:
            remove_file(rst.path)

        return rst

    def upload_files_with_user(
        self, files: List[UploadFile], current_user: User
    ) -> List[Attachment]:
        fm = FileManager(files, max_count=10, max_size=100)

        save_folder = os.path.join(
            constants.PATH_UPLOAD, datetime.now().strftime(constants.FOLDER_FORMAT)
        )
        save_rst = fm.copy_to(save_folder)

        attachments, self.count = self.dc.all(
            self.model,
            [
                {
                    "name": success["file"].filename.rsplit(".", 1)[0],
                    "original_name": success["file"].filename,
                    "mime_type": success["file"].content_type,
                    "size": success["file"].size,
                    "path": success["path"],
                    "created_by": current_user.id,
                    "updated_by": current_user.id,
                }
                for success in save_rst["success"]
            ],
        )
        self.session.commit()

        return attachments
