import os
from typing import Any, Literal

from pydantic import PostgresDsn, computed_field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from one_public_api.common import constants
from one_public_api.common.utility.files import is_installed_package


class Settings(BaseSettings):
    """
    Holds the configuration settings for an application.

    This class defines various configuration settings for the application, such as
    debug mode, API details, language settings, database configurations, logging
    options, and security settings. It provides default values and mechanisms to
    validate and compute configurations dynamically.

    Attributes
    ----------
    APP_TYPE : str
        Application type.
    DEBUG : bool
        Determines whether the application runs in debug mode.
    NAME : str
        API name.
    JSON_URL: str = "openapi.json"
        URL of the OpenAPI JSON
    LANGUAGE : str
        The language used for logs and database comments.
    RESPONSE_LANGUAGE : str
        The language used for API responses.
    LOCALES_PATH : str
        The path to the locale files used by the application.
    FEATURE_CONTROL : bool
        Indicates whether the feature availability check is enabled.
    CORS_ORIGINS: list of str
        List of allowed origins for Cross-Origin Resource Sharing (CORS).
    SECRET_KEY : str
        The application's secret key used for security.
    ACCESS_TOKEN_EXPIRE : int
        Expiration time (in minutes) for access tokens.
    REFRESH_TOKEN_EXPIRE : int
        Expiration time (in minutes) for refresh tokens.
    REFRESH_SAME_SITE: Literal["lax", "strict", "none"] | None
        Controls whether the SameSite attribute is applied to authentication cookies.
    REFRESH_TOKEN_SECURE: bool = False
        Controls whether the refresh token cookie requires HTTPS
    DB_ENGINE : str
        The database engine type, e.g., 'sqlite3' or 'postgresql'.
    DB_HOST : str
        The host address of the database.
    DB_PORT : int
        The port used to connect to the database.
    DB_NAME : str
        The name of the database.
    DB_USER : str
        The username for database authentication.
    DB_PASS : str
        The password for database authentication.
    DB_TABLE_PRE : str
        The table name prefix for database.
    DB_POOL_SIZE : int
        Number of connections to keep open in the connection pool.
    DB_MAX_OVERFLOW_SIZE : int
        Maximum number of connections allowed in the pool "overflow".
    DB_TIMEOUT : int
        Number of seconds to wait for a connection before timing out.
    LOG_LEVEL : str
        The level of logging (e.g., INFO, DEBUG).
    LOG_PATH : str
        The directory path where log files are stored.
    LOG_NAME : str
        Name of the log files.
    LOG_ROTATING_WHEN : str
        Defines the log rotation interval (e.g., 'daily').
    LOG_ROTATING_BACKUP_COUNT : int
        Number of backup logs to retain during rotation.
    LOG_FORMAT : str
        Format of the log entries.
    LOG_CONSOLE : bool
        Indicates whether logs should also be printed to the console.
    LOG_ECHO_SQL : bool
        Specifies if SQL queries should be echoed in the logs.
    """

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=constants.PATHS_ENV,
        env_file_encoding=constants.ENCODE_UTF8,
        env_prefix=constants.CHAR_PREFIX_ENV,
        extra="ignore",
    )

    # Application type
    APP_TYPE: str = ""
    # Debug mode
    DEBUG: bool = False
    # API name
    NAME: str = ""
    # URL of the OpenAPI JSON
    JSON_URL: str = "/openapi.json"
    # Language used for logs and database comments
    LANGUAGE: str = constants.DEFAULT_LANGUAGE
    # Language used for response
    RESPONSE_LANGUAGE: str = constants.DEFAULT_LANGUAGE
    # Path to locale files
    LOCALES_PATH: str = constants.DEFAULT_LOCALES_PATH
    # Enable feature availability check
    FEATURE_CONTROL: bool = False
    # Allowed origins for CORS
    CORS_ORIGINS: Any = []
    # Secret key
    SECRET_KEY: str = ""
    # Access token expiration time (in minutes)
    ACCESS_TOKEN_EXPIRE: int = constants.ACCESS_TOKEN_EXPIRE
    # Refresh token expiration time (in minutes)
    REFRESH_TOKEN_EXPIRE: int = constants.REFRESH_TOKEN_EXPIRE
    # Controls whether the SameSite attribute is applied to authentication cookies.
    REFRESH_SAME_SITE: Literal["lax", "strict", "none"] | None = None
    # Controls whether the refresh token cookie requires HTTPS
    REFRESH_TOKEN_SECURE: bool = False

    DB_ENGINE: str = "sqlite3"
    DB_HOST: str = "localhost"
    DB_PORT: int = 0
    DB_NAME: str = "opf_db" + constants.EXT_SQLITE
    DB_USER: str = ""
    DB_PASS: str = ""
    # Table name prefix
    DB_TABLE_PRE: str = constants.DB_PREFIX_SYS
    # The number of connections to keep open inside the connection pool
    DB_POOL_SIZE: int = constants.DB_DEFAULT_POOL_SIZE
    # The number of connections to allow in connection pool "overflow"
    DB_MAX_OVERFLOW_SIZE: int = constants.DB_DEFAULT_MAX_OVERFLOW_SIZE
    # The number of seconds to wait before giving up on getting a connection from
    # the pool.
    DB_TIMEOUT: int = constants.DB_DEFAULT_TIMEOUT

    @computed_field
    def db_uri(self) -> PostgresDsn | str:
        return self.create_db_uri()

    @computed_field
    def async_db_uri(self) -> PostgresDsn | str:
        return self.create_db_uri(True)

    LOG_LEVEL: str = constants.LOG_DEFAULT_LEVEL
    LOG_PATH: str = constants.LOG_DEFAULT_PATH
    LOG_NAME: str = constants.LOG_DEFAULT_NAME
    LOG_ROTATING_WHEN: str = constants.LOG_DEFAULT_ROTATING_WHEN
    LOG_ROTATING_BACKUP_COUNT: int = constants.LOG_DEFAULT_ROTATING_BACKUP_COUNT
    LOG_FORMAT: str = constants.LOG_DEFAULT_FORMAT
    LOG_CONSOLE: bool = False
    LOG_ECHO_SQL: bool = False

    # Username of Administrator
    ADMIN_USER: str = "admin"
    # E-mail of Administrator
    ADMIN_MAIL: str = "admin@one-coder.com"
    # Initial Password of Administrator
    ADMIN_PASSWORD: str = "admin"

    @computed_field
    def log_file_path(self) -> str:
        """
        Create a path to the log files.

        Returns
        -------
        path: str
            path of log files
        """

        relative_path = (
            constants.LOG_DEFAULT_PATH if is_installed_package() else constants.PATH_LOG
        )
        log_path = self.LOG_PATH if self.LOG_PATH else relative_path

        return os.path.join(log_path, self.LOG_NAME + constants.EXT_LOG)

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
