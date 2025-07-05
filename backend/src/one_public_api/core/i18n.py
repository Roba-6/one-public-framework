import gettext
import re
from gettext import GNUTranslations

from fastapi import Request

from one_public_api.common import constants
from one_public_api.common.utility.files import is_path_exists
from one_public_api.core.settings import settings


def get_language_from_request_header(request: Request) -> GNUTranslations:
    lang = request.headers.get(
        constants.HEADER_NAME_LANGUAGE, settings.RESPONSE_LANGUAGE
    )
    lang = re.split(r"[;,]", lang)[0]
    translator = gettext.translation(
        domain="messages",
        localedir=str(constants.PATH_LOCALES),
        languages=[lang],
    )
    if is_path_exists(settings.LOCALES_PATH):
        translator.add_fallback(
            gettext.translation(
                domain="messages",
                localedir=settings.LOCALES_PATH,
                languages=[lang],
            )
        )
    translator.install()

    return translator


def get_translator(request: Request) -> gettext.NullTranslations:
    """
    Retrieve a translation object for the specified language in the request
    headers.

    This function determines the language from the request object's headers and
    attempts to load the corresponding translation file. If a translation file is
    not found, it returns a `NullTranslations` instance, which serves as a no-op
    translator.

    Parameters
    ----------
    request : Request
        The HTTP request object which contains headers, including the language
        header. The language is retrieved from the header specified by
        `constants.HEADER_NAME_LANGUAGE`, with a fallback to the default language
        defined in `settings.RESPONSE_LANGUAGE`.

    Returns
    -------
    gettext.NullTranslations
        A translation object for the specified language, or a `NullTranslations`
        object if the translation file for the language is not available.
    """

    try:
        return get_language_from_request_header(request)

    except FileNotFoundError:
        return gettext.NullTranslations()


# i18n for log messages
translate_api = gettext.translation(
    "messages",
    localedir=str(constants.PATH_LOCALES),
    languages=[settings.LANGUAGE],
    fallback=True,
)
translate_ext = gettext.translation(
    "messages",
    localedir=settings.LOCALES_PATH,
    languages=[settings.LANGUAGE],
    fallback=True,
)
translate_api.add_fallback(translate_ext)

translate = _ = translate_api.gettext
