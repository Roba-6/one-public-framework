from pydantic import BaseModel
from sqlmodel import SQLModel

from one_public_api.models.system.user_model import UserBase


class AuthenticateRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(SQLModel):
    access_token: str
    token_type: str


class ProfileResponse(UserBase):
    pass
