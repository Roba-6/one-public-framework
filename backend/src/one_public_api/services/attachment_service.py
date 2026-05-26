import os
from datetime import datetime
from gettext import GNUTranslations
from pathlib import Path
from typing import Annotated, Any, Dict, List, cast
from uuid import UUID

from fastapi import UploadFile
from fastapi.params import Depends
from fastapi.responses import FileResponse, StreamingResponse
from sqlmodel import Session
from zipstream import ZipStream

from one_public_api.common import constants
from one_public_api.common.managements.file_manager import FileManager
from one_public_api.common.utility.files import clear_dir, remove_file
from one_public_api.core import get_session
from one_public_api.core.exceptions import APIError
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
        save_folder = ""
        try:
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
        except Exception as e:
            self.session.rollback()
            clear_dir(save_folder)
            self.logger.exception(e)
            raise APIError("E5000002", self._("Failed to upload files."))

    @staticmethod
    def zip_files(
        files: List[str],
        exclude: List[str] | None = None,
    ) -> ZipStream:
        zs = ZipStream()

        exclude_set = {str(Path(path).resolve()) for path in (exclude or [])}

        for target in files:
            target_path = Path(target).resolve()

            # file
            if target_path.is_file():
                if str(target_path) in exclude_set:
                    continue

                zs.add_path(
                    str(target_path),
                    arcname=target_path.name,
                )

            # directory
            elif target_path.is_dir():
                for file_path in target_path.rglob("*"):
                    # For files only
                    if not file_path.is_file():
                        continue

                    resolved = str(file_path.resolve())

                    # Skip if excluded
                    if resolved in exclude_set:
                        continue

                    zs.add_path(
                        str(file_path),
                        arcname=str(file_path.relative_to(target_path.parent)),
                    )

        return zs

    @staticmethod
    def create_attachment_response(
        data: Attachment | List[Attachment] | str | List[str] | ZipStream,
        is_preview: bool = False,
    ) -> FileResponse | StreamingResponse:
        is_stream = False
        dwl_file: Dict[str, Any] = {}
        content_disposition_type = "inline" if is_preview else "attachment"

        if isinstance(data, Attachment):
            dwl_file = {
                "path": data.path,
                "media_type": data.mime_type,
                "filename": data.original_name,
            }
        elif isinstance(data, list) and all(isinstance(d, Attachment) for d in data):
            file_name = datetime.now().strftime(constants.FILE_FORMAT)
            dwl_file = {
                "content": AttachmentService.zip_files(
                    [d.path for d in cast(list[Attachment], data)]
                ),
                "media_type": "application/zip",
                "headers": {
                    "Content-Disposition": f"{content_disposition_type}; "
                    f"filename={file_name}.{constants.EXT_ZIP}"
                },
            }
            is_stream = True

        if is_stream:
            return StreamingResponse(**dwl_file)
        else:
            return FileResponse(
                content_disposition_type=content_disposition_type, **dwl_file
            )
