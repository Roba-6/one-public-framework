import os
from logging import (
    CRITICAL,
    DEBUG,
    ERROR,
    INFO,
    WARNING,
    Formatter,
    Handler,
    Logger,
    StreamHandler,
    getLogger,
)
from logging.handlers import TimedRotatingFileHandler
from typing import TYPE_CHECKING, Dict, List

import fastapi.logger

from one_public_api.common import constants
from one_public_api.common.utility.str import convert_text_logo
from one_public_api.core.settings import Settings, settings

if TYPE_CHECKING:
    from one_public_api.core.exceptions import StartupError


class Log:
    """
    Manages logging configuration and implements the Singleton pattern for
    logger access.

    This class is designed to streamline logging setup and usage. It ensures that
    all log outputs adhere to predefined configurations, including file logging and
    console output, and supports log rotation. The Singleton pattern is applied to
    prevent multiple instances of logging configurations, ensuring consistency
    across the application.
    The class also integrates with FastAPI and uvicorn loggers for centralized control
    of log outputs.

    Attributes
    ----------
    LEVEL: Dict[str, int]
        A dictionary mapping log level names to their corresponding integer values.

    __instance : object
        Holds the class instance for a Singleton pattern.

    __settings : Settings
        Configuration settings for logging, including file path, log format,
        and rotation policies.

    __logger : Logger
        Central logging instance used across the application.
    """

    # log levels
    LEVEL: Dict[str, int] = {
        "DEBUG": DEBUG,
        "INFO": INFO,
        "WARNING": WARNING,
        "ERROR": ERROR,
        "CRITICAL": CRITICAL,
    }

    __instance: object = None
    __settings: Settings
    __logger: Logger

    def __new__(cls) -> "Log":
        """
        Creates a new instance of the Log class.

        The method is intended to prevent instantiation of the Log class by raising a
        `NotImplementedError`. It is designed to serve as a singleton or static-like
        class and does not allow object creation.

        Parameters
        ----------
        cls : type
            The class being instantiated.

        Returns
        -------
        Log
            This method does not return a value since instantiation is prevented
            and an exception is raised.

        Raises
        ------
        NotImplementedError
            Always raised to prevent instantiation of the class.
        """

        raise NotImplementedError(constants.MSG_E0000001 % "Log Class")

    @classmethod
    def init_logger(cls) -> None:
        """
        Initializes the logger for the application, setting up file and console
        log handlers, and configuring logging levels and formats. This method
        ensures that both FastAPI and Uvicorn loggers are properly configured
        and synchronized with the defined log settings in the application.

        Logs are rotated based on the configuration, and specific log formats can be
        customized. The logger also outputs custom application branding information
        when initialized.

        This process ensures logging functionality is prepared before the app starts
        serving requests, allowing detailed logging for debugging and monitoring.

        Raises
        ------
        StartupError
            If there is a permission issue while creating or writing to the log file, or
            if there is an invalid configuration key in the settings.
        """

        try:
            if not cls.__instance:
                # cls.__instance = super().__new__(cls)
                cls.__settings = settings
                # Create logger for FastAPI.
                cls.__logger = fastapi.logger.logger
                # Get logger of uvicorn.
                uvicorn_logger: Logger = getLogger("uvicorn")
                uvicorn_logger.handlers.clear()

                f_dir: str = os.path.dirname(str(cls.__settings.log_file_path))
                os.makedirs(f_dir, exist_ok=True)

                # Create a handler that outputs logs to a file.
                handlers: List[Handler] = [
                    TimedRotatingFileHandler(
                        str(cls.__settings.log_file_path),
                        when=cls.__settings.LOG_ROTATING_WHEN,
                        backupCount=cls.__settings.LOG_ROTATING_BACKUP_COUNT,
                    ),
                ]
                if cls.__settings.LOG_CONSOLE:
                    # Create a handler that outputs to standard output.
                    handlers.append(StreamHandler())
                # Configure and attach log handlers to various loggers to enable log
                # output.
                for handler in handlers:
                    handler.setLevel(cls.LEVEL["DEBUG"])
                    handler.setFormatter(Formatter("%(message)s"))
                    # Add handler to logger
                    cls.__logger.setLevel(DEBUG)
                    cls.__logger.addHandler(handler)
                cls.__logger.info(
                    convert_text_logo(constants.CHAR_LOGO) % constants.VERSION
                    + constants.CHAR_NEW_LINE
                )

                # Log handlers are reassigned and added to individual loggers as needed.
                for handler in handlers:
                    handler.setLevel(cls.LEVEL[cls.__settings.LOG_LEVEL])
                    handler.setFormatter(Formatter(cls.__settings.LOG_FORMAT))
                    # Add handler to logger
                    cls.__logger.addHandler(handler)
                    # Add handler to uvicorn logger
                    uvicorn_logger.addHandler(handler)
        except PermissionError:
            raise StartupError("E0000002", str(cls.__settings.log_file_path))
        except KeyError as e:
            raise StartupError("E0000003", e)

    @classmethod
    def get_logger(cls) -> Logger:
        """
        Provides a class-level method to access a shared logger instance.

        The method `get_logger` ensures that accessing the logger instance
        is centralized, allowing for better log management and consistency
        throughout the application. This can be particularly useful in scenarios
        where multiple components of the application rely on a shared logger
        for logging events, errors, or other messages.

        Methods
        -------
        get_logger
            Returns the logger instance that is shared across the class.
        """

        return cls.__logger


Log.init_logger()
logger = Log.get_logger()
