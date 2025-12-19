from typing import Any

from fastapi import HTTPException, status

from one_public_api.common import constants
from one_public_api.core.i18n import translate as _
from one_public_api.core.log import logger
from one_public_api.schemas.response_schema import MessageSchema


class StartupError(Exception):
    def __init__(self, code: str, data: Any = ""):
        err_msg = getattr(constants, "MSG_" + code)
        err_msg = err_msg % str(data) if err_msg.find("%s") >= 0 else err_msg

        super().__init__(err_msg)
        self.message = err_msg

        print(f"ERROR [{code}] {err_msg}")


class APIError(HTTPException):
    headers = {constants.HEADER_NAME_AUTHENTICATE: "Bearer"}

    def __init__(
        self,
        code: str,
        message: str = "",
        detail: Any | None = None,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
    ):
        logger.error(_("API_ERROR_OCCURRED"), code, message, detail)

        msg_rsp = MessageSchema(code=code, message=message, detail=detail).model_dump()
        super().__init__(status_code=status_code, detail=msg_rsp, headers=self.headers)


class DataError(APIError):
    def __init__(
        self,
        message: str = "",
        detail: Any | None = None,
        code: str = "E4090000",
        status_code: int = status.HTTP_409_CONFLICT,
    ):
        super().__init__(code, message, detail, status_code)


class UnauthorizedError(APIError):
    def __init__(
        self,
        message: str = "",
        detail: Any | None = None,
        code: str = "E4010000",
    ):
        super().__init__(code, message, detail, status.HTTP_401_UNAUTHORIZED)


class ForbiddenError(APIError):
    def __init__(
        self,
        message: str = "",
        detail: Any | None = None,
        code: str = "E4030000",
    ):
        super().__init__(code, message, detail, status.HTTP_403_FORBIDDEN)
