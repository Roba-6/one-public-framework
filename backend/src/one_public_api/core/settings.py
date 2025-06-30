import os
from typing import Any, List

from pydantic import PostgresDsn, computed_field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from one_public_api.common import constants


class Settings(BaseSettings):
    """
    Configuration settings for the application.

    This class provides a mechanism to manage configurations for the application,
    including database settings, logging options, and environment-specific values
    as defined in external files. It allows for the seamless integration of runtime
    configuration options using environment variables. Additionally, it includes
    methods to dynamically generate computed fields for database and logging settings.

    Attributes
    ----------
    LANGUAGE : str
        Default language for the application.
    FEATURE_CONTROL : bool
        Flag to verify feature accessibility.
    CORS_ORIGINS : List[str]
        List of allowed origins for CORS.
    SECRET_KEY : str
        Secret key.
    ACCESS_TOKEN_EXPIRE : int
        Access token expiration time (in minutes)
    REFRESH_TOKEN_EXPIRE : int
        Refresh token expiration time (in minutes)
    DB_ENGINE : str
        Engine type for the database (e.g., 'sqlite3', 'postgresql').
    DB_HOST : str
        Hostname of the database server.
    DB_PORT : int
        Port number for the database server.
    DB_NAME : str
        Name of the database.
    DB_USER : str
        Username for authenticating with the database.
    DB_PASS : str
        Password for authenticating with the database.
    DB_MAX_OVERFLOW_SIZE : int
        Maximum overflow size for the database connection pool.
    DB_POOL_SIZE : int
        Size of the database connection pool.
    DB_TIMEOUT : int
        Timeout duration for database connections.
    db_uri : PostgresDsn or str
        Fully constructed database URI for synchronous database engines, calculated
        dynamically based on configuration settings.
    async_db_uri : PostgresDsn or str
        Fully constructed database URI for asynchronous database engines, calculated
        dynamically based on configuration settings.
    LOG_LEVEL : str
        Logging level for application logs.
    LOG_LANGUAGE : str
        Language for log messages.
    LOG_NAME : str
        Name of the log file.
    LOG_ROTATING_WHEN : str
        Scheduling interval for rotating logs (e.g., 'daily').
    LOG_ROTATING_BACKUP_COUNT : int
        Number of backup files to retain for rotated logs.
    LOG_FORMAT : str
        Format string for log messages.
    LOG_CONSOLE : bool
        Flag to determine if logs should also be printed to the console.
    log_file_path : str
        Absolute path to the generated log files, calculated dynamically based on
        logging configuration.
    LOG_ECHO_SQL : bool
        Flag indicating whether SQL statements should be echoed in the logs.
    """

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=constants.PATHS_ENV,
        env_file_encoding=constants.ENCODE_UTF8,
        env_prefix=constants.CHAR_PREFIX_ENV,
        extra="ignore",
    )

    LANGUAGE: str = constants.DEFAULT_LANGUAGE
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

    LOG_LEVEL: str = constants.LOG_DEFAULT_LEVEL
    LOG_LANGUAGE: str = constants.DEFAULT_LANGUAGE
    LOG_NAME: str = constants.LOG_DEFAULT_NAME
    LOG_ROTATING_WHEN: str = constants.LOG_DEFAULT_ROTATING_WHEN
    LOG_ROTATING_BACKUP_COUNT: int = constants.LOG_DEFAULT_ROTATING_BACKUP_COUNT
    LOG_FORMAT: str = constants.LOG_DEFAULT_FORMAT
    LOG_CONSOLE: bool = True

    @computed_field
    def log_file_path(self) -> str:
        """
        Create an absolute path to the log files.

        Returns
        -------
        path: str
            absolute path of log files
        """

        return os.path.join(constants.PATH_LOG, self.LOG_NAME + constants.EXT_LOG)

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
                else f"{scheme}:///{constants.PATH_APP}/{self.DB_NAME}"
            )
        else:
            raise ValueError(constants.MSG_E0010001 % self.DB_ENGINE)


settings: Settings = Settings()
