from datetime import datetime, timedelta, timezone
from gettext import GNUTranslations
from typing import Annotated, Dict

import bcrypt
import jwt
from fastapi import HTTPException, Response
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from one_public_api.common import constants
from one_public_api.common.utility.str import to_camel
from one_public_api.core import get_session, get_translator, settings
from one_public_api.core.exceptions import APIError, ForbiddenError, UnauthorizedError
from one_public_api.models import User
from one_public_api.schemas.authenticate_schema import LoginRequest
from one_public_api.services.base_service import BaseService


class AuthenticateService(BaseService[User]):
    model = User

    def __init__(
        self,
        session: Annotated[Session, Depends(get_session)],
        translator: Annotated[GNUTranslations, Depends(get_translator)],
    ):
        super().__init__(session, translator)

    def login(
        self,
        request: LoginRequest | OAuth2PasswordRequestForm,
        response: Response | None = None,
    ) -> Dict[str, str]:
        try:
            user: User = self.get_one({"name": request.username})
            if user.is_disabled:
                raise ForbiddenError(
                    self._("user disabled"), request.username, "E40300001"
                )
            elif user.is_locked:
                raise ForbiddenError(
                    self._("user locked"), request.username, "E40300002"
                )
            elif not self.verify_password(request.password, user.password):
                user.login_failed_times += 1
                if user.login_failed_times >= constants.MAX_LOGIN_FAILED_TIMES:
                    user.is_locked = True
                self.update_one(user)
                raise UnauthorizedError(
                    self._("user not verified"), request.username, "E40100001"
                )
            else:
                # When authentication is successful
                access_token, access_expire = AuthenticateService.create_token(
                    user,
                    timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE),
                )
                refresh_token, refresh_expire = AuthenticateService.create_token(
                    user,
                    timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE),
                    constants.CHAR_REFRESH_TOKEN_KEY,
                )
                if not user.is_locked or user.login_failed_times > 0:
                    user.login_failed_times = 0
                    self.update_one(user)

                if response:
                    response.set_cookie(
                        key=constants.CHAR_REFRESH_TOKEN_KEY,
                        value=refresh_token,
                        httponly=True,
                        samesite="strict",
                        expires=refresh_expire
                        if getattr(request, "remember_me", None)
                        else None,
                    )
                if isinstance(request, LoginRequest):
                    return {to_camel("access_token"): access_token}
                else:
                    return {"access_token": access_token}
        except APIError:
            raise
        except HTTPException:
            raise UnauthorizedError(
                self._("user not found"), request.username, "E40100002"
            )

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(
            plain_password.encode(constants.ENCODE_UTF8),
            hashed_password.encode(constants.ENCODE_UTF8),
        )

    @staticmethod
    def create_token(
        user: User,
        expires_delta: timedelta | None = None,
        scope: str | None = None,
    ) -> tuple[str, datetime]:
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(
                minutes=constants.ACCESS_TOKEN_EXPIRE
            )
        data = {"sub": user.name, "exp": expire}
        if scope:
            data.update({"scope": scope})
        encoded_jwt = jwt.encode(
            data, settings.SECRET_KEY, algorithm=constants.JWT_ALGORITHM
        )

        return encoded_jwt, expire
