import mimetypes
import os
import shutil
from datetime import datetime
from gettext import GNUTranslations
from pathlib import Path
from typing import Annotated, Any, Dict, Generator, List, Union, cast
from urllib.parse import quote
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
from one_public_api.core.exceptions import APIError, DataError
from one_public_api.core.i18n import get_translator
from one_public_api.core.settings import settings
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
                        "path": success["path"].removeprefix(
                            str(settings.media_file_path) + "/"
                        ),
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
            raise APIError("E5000001", self._("Failed to upload files."))

    @staticmethod
    def zip_files(
        files: List[str],
        exclude: List[str] | None = None,
        delete_after_zip: bool = False,
    ) -> Generator[bytes, None, None]:
        try:
            zs = ZipStream()

            exclude_paths = [Path(path).resolve() for path in (exclude or [])]

            def is_excluded(path: Path) -> bool:
                resolved = path.resolve()
                return any(
                    resolved == exclude_path
                    or (exclude_path.is_dir() and resolved.is_relative_to(exclude_path))
                    for exclude_path in exclude_paths
                )

            for target in files:
                target_path = Path(target).resolve()

                # file
                if target_path.is_file():
                    if is_excluded(target_path):
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

                        # Skip if excluded
                        if is_excluded(file_path):
                            continue

                        zs.add_path(
                            str(file_path),
                            arcname=str(file_path.relative_to(target_path)),
                        )

            yield from zs
        finally:
            if delete_after_zip:
                for file in files:
                    shutil.rmtree(file)

    def create_attachment_response(
        self,
        data: Union[
            Attachment, List[Attachment], str, List[str], Generator[bytes, None, None]
        ],
        is_preview: bool = False,
        is_thumbnail: bool = False,
        zip_file_name: str | None = None,
        delete_after_zip: bool = False,
    ) -> FileResponse | StreamingResponse:
        is_stream = False
        dwl_file: Dict[str, Any] = {}
        content_disposition_type = "inline" if is_preview else "attachment"

        if isinstance(data, Attachment):
            if is_thumbnail:
                if data.thumbnail_path:
                    data_path = data.thumbnail_path
                else:
                    raise DataError(self._("Thumbnail not found."), code="E4040002")
            else:
                data_path = data.path

            path = os.path.join(str(settings.media_file_path), data_path)

            dwl_file = {
                "path": path,
                "media_type": data.mime_type,
                "filename": data.original_name,
            }
        elif isinstance(data, str):
            dwl_file = {
                "path": data,
                "media_type": mimetypes.guess_type(data)[0],
                "filename": Path(data).name,
            }
        elif isinstance(data, list) or isinstance(data, Generator):
            is_stream = True
            file_name = (
                quote(zip_file_name)
                if zip_file_name
                else datetime.now().strftime(constants.FILE_FORMAT)
            )
            dwl_file = {
                "media_type": "application/zip",
                "headers": {
                    "Content-Disposition": f"{content_disposition_type}; "
                    f"filename*=UTF-8''{file_name}{constants.EXT_ZIP}"
                },
            }
            if isinstance(data, list) and all(isinstance(d, Attachment) for d in data):
                dwl_file.update(
                    {
                        "content": AttachmentService.zip_files(
                            [
                                os.path.join(str(settings.media_file_path), d.path)
                                for d in cast(list[Attachment], data)
                            ],
                            delete_after_zip=delete_after_zip,
                        )
                    }
                )
            elif isinstance(data, list) and all(isinstance(d, str) for d in data):
                dwl_file.update(
                    {
                        "content": AttachmentService.zip_files(
                            [d for d in cast(list[str], data)],
                            delete_after_zip=delete_after_zip,
                        )
                    }
                )
            elif isinstance(data, Generator):
                dwl_file.update({"content": data})

        if is_stream:
            return StreamingResponse(**dwl_file)
        else:
            return FileResponse(
                content_disposition_type=content_disposition_type, **dwl_file
            )
