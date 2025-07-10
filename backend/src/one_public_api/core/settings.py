import os
from typing import Any, List

from pydantic import PostgresDsn, computed_field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from one_public_api.common import constants


class Settings(BaseSettings):
    """
    Settings configuration class for application.

    This class is used to manage runtime configurations and environment-specific
    settings for a Python application. It supports configuration of environment
    variables and default values. The class also provides computed fields and
    validators for dynamic attributes or specific preprocessing of the attributes.

    Attributes
    ----------
    TITLE : str
        Title of the application.
    RESPONSE_LANGUAGE : str
        Default response language for the application.
    LOCALES_PATH : str
        Path to localization files.
    FEATURE_CONTROL : bool
        Flag to enable or disable feature control.
    CORS_ORIGINS : List[str]
        List of allowed origins for Cross-Origin Resource Sharing (CORS).

    SECRET_KEY : str
        Secret key for cryptographic operations.
    ACCESS_TOKEN_EXPIRE : int
        Expiration time (in seconds) for access tokens.
    REFRESH_TOKEN_EXPIRE : int
        Expiration time (in seconds) for refresh tokens.

    DB_ENGINE : str
        Database engine to use (e.g. sqlite3, postgresql).
    DB_HOST : str
        Host address for the database server.
    DB_PORT : int
        Port number for the database server.
    DB_NAME : str
        Name of the database.
    DB_USER : str
        Username for the database authentication.
    DB_PASS : str
        Password for the database authentication.
    DB_MAX_OVERFLOW_SIZE : int
        Maximum overflow size for the database connection pool.
    DB_POOL_SIZE : int
        Size of the database connection pool.
    DB_TIMEOUT : int
        Timeout duration for database connections.

    LANGUAGE : str
        Application language setting.
    LOG_LEVEL : str
        Default logging level.
    LOG_PATH : str
        Path for storing log files.
    LOG_NAME : str
        Name of the log files.
    LOG_ROTATING_WHEN : str
        Condition for rotating the log files (e.g., time interval).
    LOG_ROTATING_BACKUP_COUNT : int
        Number of backup log files to keep when rotating logs.
    LOG_FORMAT : str
        Format of the logs.
    LOG_CONSOLE : bool
        Flag to enable or disable console logging.
    LOG_ECHO_SQL : bool
        Flag to enable or disable SQL query logging for debugging purposes.
    """

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=constants.PATHS_ENV,
        env_file_encoding=constants.ENCODE_UTF8,
        env_prefix=constants.CHAR_PREFIX_ENV,
        extra="ignore",
    )

    TITLE: str = ""
    RESPONSE_LANGUAGE: str = constants.DEFAULT_LANGUAGE
    LOCALES_PATH: str = constants.DEFAULT_LOCALES_PATH
    FEATURE_CONTROL: bool = False
    CORS_ORIGINS: List[str] = []

    SECRET_KEY: str = ""
    ACCESS_TOKEN_EXPIRE: int = constants.ACCESS_TOKEN_EXPIRE
    REFRESH_TOKEN_EXPIRE: int = constants.REFRESH_TOKEN_EXPIRE

    DB_ENGINE: str = "sqlite3"
    DB_HOST: str = "localhost"
    DB_PORT: int = 0
    DB_NAME: str = "opf_db" + constants.EXT_SQLITE
    DB_USER: str = ""
    DB_PASS: str = ""
    DB_MAX_OVERFLOW_SIZE: int = constants.DB_DEFAULT_MAX_OVERFLOW_SIZE
    DB_POOL_SIZE: int = constants.DB_DEFAULT_POOL_SIZE
    DB_TIMEOUT: int = constants.DB_DEFAULT_TIMEOUT

    @computed_field
    def db_uri(self) -> PostgresDsn | str:
        return self.create_db_uri()

    @computed_field
    def async_db_uri(self) -> PostgresDsn | str:
        return self.create_db_uri(True)

    LANGUAGE: str = constants.DEFAULT_LANGUAGE
    LOG_LEVEL: str = constants.LOG_DEFAULT_LEVEL
    LOG_PATH: str = constants.LOG_DEFAULT_PATH
    LOG_NAME: str = constants.LOG_DEFAULT_NAME
    LOG_ROTATING_WHEN: str = constants.LOG_DEFAULT_ROTATING_WHEN
    LOG_ROTATING_BACKUP_COUNT: int = constants.LOG_DEFAULT_ROTATING_BACKUP_COUNT
    LOG_FORMAT: str = constants.LOG_DEFAULT_FORMAT
    LOG_CONSOLE: bool = True

    @computed_field
    def log_file_path(self) -> str:
        """
        Create a path to the log files.

        Returns
        -------
        path: str
            path of log files
        """

        log_path = self.LOG_PATH if self.LOG_PATH else constants.LOG_DEFAULT_PATH

        return os.path.join(log_path, self.LOG_NAME + constants.EXT_LOG)

    LOG_ECHO_SQL: bool = False

    @field_validator("CORS_ORIGINS", mode="before")
    def split_origins(cls, v: Any) -> Any:  # noqa
        if isinstance(v, str):
            return [s.strip() for s in v.split(",")]
        return v

    def create_db_uri(self, is_async: bool = False) -> PostgresDsn | str:
        if self.DB_ENGINE == "postgresql":
            scheme = "postgresql+asyncpg" if is_async else "postgresql+psycopg2"
            return PostgresDsn.build(
                scheme=scheme,
                username=self.DB_USER,
                password=self.DB_PASS,
                host=self.DB_HOST,
                port=self.DB_PORT,
                path=self.DB_NAME,
            )
        elif self.DB_ENGINE == "sqlite3":
            scheme = "sqlite+aiosqlite" if is_async else "sqlite"
            return (
                f"{scheme}:///{self.DB_NAME}"
                if self.DB_NAME == ":memory:"
                else f"{scheme}:///{self.DB_NAME}"
            )
        else:
            raise ValueError(constants.MSG_E0010001 % self.DB_ENGINE)


settings: Settings = Settings()
