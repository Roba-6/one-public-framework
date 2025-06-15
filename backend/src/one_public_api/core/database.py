from typing import Any, Dict, Generator

from sqlmodel import Session, create_engine

from one_public_api.core.settings import settings
from one_public_api.models import *  # noqa

engine_options: Dict[str, Any] = {
    "url": str(settings.db_uri),
    "echo": settings.LOG_ECHO_SQL,
}

if settings.DB_ENGINE == "postgresql":
    engine_options.update(
        {
            "max_overflow": settings.DB_MAX_OVERFLOW_SIZE,
            "pool_size": settings.DB_POOL_SIZE,
            "pool_timeout": settings.DB_TIMEOUT,
        }
    )

engine = create_engine(**engine_options)

session: Any = Session(engine)


def get_session() -> Generator[Session, Any, None]:
    """
    Generate a session from the database engine.

    This function initializes a session using the provided database engine
    and yields it for use. The session is designed to be used as a context
    manager, ensuring that resources are properly cleaned up after use.

    Yields
    ------
    Generator[Session, Any, None]
        A database session instance generated using the configured engine.
    """

    with Session(engine) as s:
        yield s
