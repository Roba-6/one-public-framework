from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, LiteralString

from fastapi import UploadFile

from one_public_api.common.utility.files import make_deep_dir
from one_public_api.core.log import logger


class FileManager:
    """Utility class for managing file operations within the application."""

    def __init__(
        self, files: List[UploadFile], max_count: int = 10, max_size: int = 100
    ) -> None:
        self.max_count = max_count
        self.max_size = max_size
        self.files = files
        self.save_folder = ""
        # {"success": [{"file":"", "path":""}], "failed": [{"file": "", "reason": ""}]}
        self.detail: Dict[str, List[Any]] = {"success": [], "failed": []}

    def copy_to(self, dst: str | LiteralString) -> Dict[str, List[Any]]:
        self.save_folder = dst
        make_deep_dir(dst)

        for file in self.files:
            try:
                suffix = Path(str(file.filename)).suffix.lower()
                content = file.file.read()

                save_path = (
                    f"{dst}/{str(datetime.now().timestamp()).replace('.', '')}{suffix}"
                )
                with open(save_path, "wb") as f:
                    f.write(content)
                self.detail["success"].append({"file": file, "path": save_path})
            except Exception as e:
                reason = f"Failed to copy file {file.filename} to {dst}: {e}"
                logger.exception(reason)
                self.detail["failed"].append({"file": file, "reason": reason})
                continue

        return self.detail

    def validate(self) -> None:
        for file in self.files:
            if file.size and file.size > self.max_size:
                self.detail["failed"].append(
                    {"file": file.filename, "reason": "file size exceeds limit"}
                )
                continue
            if len(self.detail["success"]) >= self.max_count:
                self.detail["failed"].append(
                    {"file": file.filename, "reason": "maximum file count reached"}
                )
                continue
            self.detail["success"].append(
                {
                    "file": file.filename,
                    "path": f"{self.save_folder}/{datetime.now().timestamp()}."
                    f"{Path(str(file.filename)).suffix.lower()}",
                }
            )
