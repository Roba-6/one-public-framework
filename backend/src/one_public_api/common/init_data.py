from typing import Any, Dict, List, Optional

from fastapi import FastAPI
from sqlalchemy.exc import NoResultFound
from sqlmodel import Session

from one_public_api.common.utility.search import add_maintenance
from one_public_api.common.utility.str import get_hashed_password
from one_public_api.core.settings import settings
from one_public_api.crud.data_creator import DataCreator
from one_public_api.crud.data_reader import DataReader
from one_public_api.crud.data_updater import DataUpdater
from one_public_api.models import Category, Configuration, Feature, User
from one_public_api.models.system.configuration_model import ConfigurationType
from one_public_api.routers.base_route import BaseRoute


def init_users(session: Session) -> User:
    user: Optional[User]
    try:
        dr = DataReader(session)
        user = dr.one(User, {"name": settings.ADMIN_USER})
    except NoResultFound:
        users: List[Dict[str, Any]] = [
            {
                "name": settings.ADMIN_USER,
                "email": settings.ADMIN_MAIL,
                "password": get_hashed_password(settings.ADMIN_PASSWORD),
            }
        ]
        dc = DataCreator(session)
        user = dc.all_if_not_exists(User, users)[0]
        session.commit()

    return user


def init_configurations(session: Session, user: User) -> None:
    configurations: List[Dict[str, Any]] = [
        {"name": "Application Name", "key": "app_name", "type": ConfigurationType.SYS},
        {"name": "Application URL", "key": "app_url", "type": ConfigurationType.SYS},
        {"name": "Time Zone", "key": "time_zone", "type": ConfigurationType.SYS},
        {"name": "Language", "key": "language", "type": ConfigurationType.SYS},
    ]
    configurations = add_maintenance(configurations, user)

    dc = DataCreator(session)
    dc.all_if_not_exists(Configuration, configurations)
    session.commit()


def init_features(app: FastAPI, session: Session, user: User) -> None:
    features: List[Dict[str, Any]] = []
    feature_descriptions: Dict[str, str] = {}
    for route in app.routes:
        if isinstance(route, BaseRoute):
            features.append({"name": getattr(route, "name")})
            feature_descriptions[getattr(route, "name")] = getattr(route, "description")

    dc = DataCreator(session)
    du = DataUpdater(session)

    features = add_maintenance(features, user)

    features_list: List[Feature] = dc.all_if_not_exists(Feature, features)
    for feature in features_list:
        feature.description = feature_descriptions[feature.name]
        du.one(feature)
    session.commit()


def init_categories(session: Session, user: User) -> None:
    categories: List[Dict[str, Any]] = [
        {
            "name": "管理者",
            "value": "ADM",
            "options": {"type": "OrganizationType"},
        },
        {
            "name": "倉庫運営会社",
            "value": "COY",
            "options": {"type": "OrganizationType"},
        },
        {
            "name": "エリア倉庫",
            "value": "WHS",
            "options": {"type": "OrganizationType"},
        },
        {
            "name": "店舗グループ",
            "value": "SGP",
            "options": {"type": "OrganizationType"},
        },
        {
            "name": "店舗",
            "value": "SHP",
            "options": {"type": "OrganizationType"},
        },
    ]
    categories = add_maintenance(categories, user)

    dc = DataCreator(session)
    dc.all_if_not_exists(Category, categories)
    session.commit()
