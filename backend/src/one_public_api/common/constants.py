# ===== Constant Definitions ===========================================================
import importlib.resources
import os
from pathlib import Path
from typing import List, Tuple

# Version of the One Public API
VERSION: str = "0.1.0-alpha.12"
# Default Language
DEFAULT_LANGUAGE: str = "en"
# Default path for locale files
DEFAULT_LOCALES_PATH: str = "locales"

# ----- Encoding Constants -------------------------------------------------------------
# Encoding format: UTF-8
ENCODE_UTF8: str = "utf-8"

# ----- File Settings ------------------------------------------------------------------
# Log File Extension
EXT_LOG = ".log"
# SQLite File Extension
EXT_SQLITE = ".sqlite3"

# ----- Security Settings --------------------------------------------------------------
# Access token expiration time (in minutes)
ACCESS_TOKEN_EXPIRE = 15
# Refresh token expiration time (in minutes)
REFRESH_TOKEN_EXPIRE = 30 * 24 * 60
# Algorithm used to sign the JWT tokens (e.g., HS256, RS256)
JWT_ALGORITHM = "HS256"

# File name for .env files
FILES_ENV: List[str] = [".env", ".env.dev", ".env.test", ".env.stage", ".env.prod"]

# Folder for localization resources
FOLDER_LOCALES: str = "locales"
# Output folder for log files
FOLDER_LOGS: str = "logs"
# Root folder of the source code
FOLDER_SRC: str = "src"
# Root folder of the OPA
FOLDER_OPA: str = "one_public_api"

# Absolute Path of Application directory
PATH_APP: str = str(Path(__file__).resolve().parent.parent.parent.parent.parent)
# Absolute Path of backend directory
PATH_ROOT: str = str(Path(__file__).resolve().parent.parent.parent.parent)
# Absolute Path of log directory
PATH_LOG: str = os.path.join(PATH_APP, FOLDER_LOGS)
# Absolute Path of src directory
PATH_SRC: str = os.path.join(PATH_ROOT, FOLDER_SRC)
# Absolute Path of OPA directory
PATH_OPA = importlib.resources.files("one_public_api")
# Absolute Path of language package directory
PATH_LOCALES = PATH_OPA.joinpath(FOLDER_LOCALES)
# Environment File Path
# Files listed later have higher priority; earlier ones are ignored if multiple exists.
PATHS_ENV: Tuple[str, ...] = tuple(os.path.join(PATH_APP, env) for env in FILES_ENV)

# ----- Database Settings --------------------------------------------------------------
# The default number of connections to keep open inside the connection pool
DB_DEFAULT_POOL_SIZE: int = 5
# The default number of connections to allow in connection pool "overflow"
# (2× DB_DEFAULT_POOL_SIZE)
DB_DEFAULT_MAX_OVERFLOW_SIZE: int = 10
# The default number of seconds to wait before giving up on getting a connection from
# the pool.
DB_DEFAULT_TIMEOUT: int = 30

# The default number of rows to return in a query result
DB_DEFAULT_LIMIT: int = 10
# The maximum number of rows to return in a query result
DB_MAX_LIMIT: int = 100

# Table name prefix for system tables
DB_PREFIX_SYS: str = "sys_"

# ----- API URL Settings ---------------------------------------------------------------
# Common router path: blank
ROUTER_COMMON_BLANK = ""
# Common router path: ID
ROUTER_COMMON_WITH_ID = "/{target_id}"
# Common router path: admin
ROUTER_COMMON_ADMIN = "/admin"
# Common router path: admin with ID
ROUTER_COMMON_ADMIN_WITH_ID = "/admin/{target_id}"

# Signup API router path
ROUTER_AUTH_SIGNUP = "/signup"
# Login API router path
ROUTER_AUTH_LOGIN = "/login"
# Refresh Token API router path
ROUTER_AUTH_REFRESH = "/refresh"
# Profile API router path
ROUTER_AUTH_PROFILE = "/me"
# Logout API router path
ROUTER_AUTH_LOGOUT = "/logout"
# Force logout API router path
ROUTER_AUTH_FORCE_LOGOUT = "/force_logout"

# Path prefix for the authentication API router
ROUTER_PREFIX_AUTHENTICATION = "/auth"
# Path prefix for the feature API router
ROUTER_PREFIX_FEATURE = "/features"
# Path prefix for the configuration API router
ROUTER_PREFIX_CONFIGURATION = "/configurations"
# Path prefix for the user API router
ROUTER_PREFIX_USER = "/users"

# ----- Log Settings -------------------------------------------------------------------
# Default logging level for the API.
LOG_DEFAULT_LEVEL: str = "DEBUG"
# Default path for the log files.
LOG_DEFAULT_PATH: str = "logs"
# Default name for the logger instance.
LOG_DEFAULT_NAME: str = "api"
# Defines the rotation policy for log files.
LOG_DEFAULT_ROTATING_WHEN: str = "D"
# Number of backup log files to be kept after rotation.
LOG_DEFAULT_ROTATING_BACKUP_COUNT: int = 7
# Specifies the default format of log messages.
LOG_DEFAULT_FORMAT: str = "%(asctime)s %(levelname)s\t%(name)s %(message)s"

# ----- Various Strings ----------------------------------------------------------------
# Text Logo
CHAR_LOGO: str = (
    "S3U7S1U6S1U700S2P1S7P1S3U2S1B1S4U3P100S2P1S3"
    "H1S3P1S4U2L1S4U3P100S2P1U7P1U3P1S2P1U3P1S4"
)

# Prefix for items loadable from the .env file
CHAR_PREFIX_ENV: str = "API_"
# Newline character
CHAR_NEW_LINE: str = "\n"
# Key name used to store or retrieve the refresh token in cookies
CHAR_REFRESH_TOKEN_KEY = "refresh_token"

# Authenticate Header Name
HEADER_NAME_AUTHENTICATE = "WWW-Authenticate"
# Language Header Name
HEADER_NAME_LANGUAGE = "Accept-Language"

# ----- Various Numeric Values ---------------------------------------------------------
LENGTH_1: int = 1
LENGTH_3: int = 3
LENGTH_6: int = 6
LENGTH_9: int = 9
LENGTH_10: int = 10
LENGTH_13: int = 13
LENGTH_20: int = 20
LENGTH_55: int = 55
LENGTH_64: int = 64
LENGTH_100: int = 100
LENGTH_128: int = 128
LENGTH_255: int = 255
LENGTH_500: int = 500
LENGTH_1000: int = 1000

# Maximum number of allowed failed login attempts before locking the account
MAX_FAILED_ATTEMPTS: int = 5

# ----- System Messages ----------------------------------------------------------------
# Debug Messages
MSG_D0000000: str = "Settings: %s"

# Error Messages
MSG_E0000001: str = "Implemented Error: %s"
MSG_E0000002: str = "Cannot write to the log file: %s permission denied."
MSG_E0000003: str = "Logger initialization failed: invalid configuration %s."
MSG_E0000004: str = "Logger initialization failed."
MSG_E0010001: str = "Unsupported Database Engine: %s"
