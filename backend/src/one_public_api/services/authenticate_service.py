from datetime import datetime, timedelta, timezone
from gettext import GNUTranslations
from typing import Annotated, Dict

import bcrypt
import jwt
from fastapi import HTTPException, Response
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlmodel import Session

from one_public_api.common import constants
from one_public_api.common.tools import get_username_from_token
from one_public_api.common.utility.search import find_in_model_list
from one_public_api.common.utility.str import to_camel
from one_public_api.core import get_session
from one_public_api.core.exceptions import APIError, ForbiddenError, UnauthorizedError
from one_public_api.core.extensions import oauth2_scheme
from one_public_api.core.i18n import get_translator
from one_public_api.core.i18n import translate as _
from one_public_api.core.settings import settings
from one_public_api.models import Token, User
from one_public_api.models.system.token_model import TokenType
from one_public_api.schemas.authenticate_schema import LoginRequest
from one_public_api.services.base_service import BaseService
from one_public_api.services.user_service import UserService


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
            self.is_activate_user(user)
            if not (
                request.password
                and user.password
                and self.verify_password(request.password, user.password)
            ):
                user.failed_attempts += 1
                if user.failed_attempts >= constants.MAX_FAILED_ATTEMPTS:
                    user.is_locked = True
                self.update_one(user)
                raise UnauthorizedError(
                    self._("user not verified"), request.username, "E4010001"
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

                # Delete the user tokens if them exists.
                self.dd.all(user.tokens)
                self.session.refresh(user)

                # save new tokens to db.
                user.tokens.append(Token(token=access_token, type=TokenType.ACCESS))
                user.tokens.append(Token(token=refresh_token, type=TokenType.REFRESH))

                # Clear the login failed attempts.
                if not user.is_locked or user.failed_attempts > 0:
                    user.failed_attempts = 0
                    self.update_one(user)

                self.session.commit()

                if response:
                    response.set_cookie(
                        key=constants.CHAR_REFRESH_TOKEN_KEY,
                        value=refresh_token,
                        httponly=True,
                        samesite=settings.REFRESH_SAME_SITE,
                        secure=settings.REFRESH_TOKEN_SECURE,
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
                self._("user not found"), request.username, "E4010002"
            )

    def refresh(self, refresh_token: str) -> Dict[str, str]:
        try:
            user: User = self.get_one({"name": get_username_from_token(refresh_token)})
            self.is_activate_user(user)
            access_token, access_expire = AuthenticateService.create_token(
                user,
                timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE),
            )
            # Check the refresh token of the currently logged-in user
            saved_refresh_token: Token | None = find_in_model_list(
                user.tokens, "type", TokenType.REFRESH
            )
            if not saved_refresh_token or saved_refresh_token.token != refresh_token:
                raise InvalidTokenError

            # Update the access token if it exists.
            token: Token | None = find_in_model_list(
                user.tokens, "type", TokenType.ACCESS
            )
            if token is not None:
                token.token = access_token
                self.du.one(token)
                self.session.commit()

            return {to_camel("access_token"): access_token}
        except ExpiredSignatureError:
            raise UnauthorizedError(
                self._("The token has expired"), refresh_token, "E4010007"
            )
        except InvalidTokenError:
            raise UnauthorizedError(
                self._("Invalid refresh token"), refresh_token, "E4010008"
            )
        except HTTPException:
            raise UnauthorizedError(self._("user not found"), refresh_token, "E4010009")

    def logout(self, response: Response, current_user: User | None = None) -> None:
        """
        Logs the user out by deleting all tokens from the database and clearing
        the refresh token cookie.

        Parameters
        ----------
        response : Response
            The HTTP response object used to delete the refresh token cookie.
        current_user : User | None
            The user who is logging out of the system.

        Returns
        -------
        None
            This function does not return any value.
        """

        if current_user is not None:
            self.dd.all(current_user.tokens)
            self.session.refresh(current_user)
            self.session.commit()

        response.delete_cookie(
            key=constants.CHAR_REFRESH_TOKEN_KEY,
        )

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(
            plain_password.encode(constants.ENCODE_UTF8),
            hashed_password.encode(constants.ENCODE_UTF8),
        )

    def is_activate_user(self, user: User) -> None:
        if not user.is_enabled:
            raise ForbiddenError(self._("user disabled"), user.name, "E4030001")
        elif user.is_locked:
            raise ForbiddenError(self._("user locked"), user.name, "E4030002")

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


def get_current_user(
    us: Annotated[UserService, Depends()],
    token: Annotated[str, Depends(oauth2_scheme)],
) -> User:
    try:
        username = get_username_from_token(token)
        if username is None:
            raise UnauthorizedError(
                _("No user information found in the token"), token, "E4010003"
            )
        else:
            user: User = us.get_one(
                {"name": username, "is_enabled": True, "is_locked": False}
            )

            if len(user.tokens) == 0:
                """Forced logout is required."""
                raise UnauthorizedError(
                    _("Your account has been logged out."), token, "E4010007"
                )
            elif find_in_model_list(user.tokens, "token", token) is None:
                """Forced logout is required."""
                raise UnauthorizedError(
                    _("Your account has been logged in from another location."),
                    token,
                    "E4010006",
                )

            return user
    except ExpiredSignatureError:
        raise UnauthorizedError(_("The token has expired"), token, "E4010004")
    except InvalidTokenError:
        raise UnauthorizedError(_("Invalid access token"), token, "E4010005")
    except HTTPException:
        raise
