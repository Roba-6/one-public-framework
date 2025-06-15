from typing import Any, Dict, List

from fastapi import FastAPI
from sqlmodel import Session

from one_public_api.crud.data_creator import DataCreator
from one_public_api.models import Configuration, Feature, User
from one_public_api.models.system.configuration_model import ConfigurationType
from one_public_api.routers.base_route import BaseRoute


def init_configurations(session: Session) -> None:
    configurations: List[Dict[str, Any]] = [
        {
            "name": "Application Name",
            "key": "app_name",
            "value": "One Public Framework",
            "type": ConfigurationType.SYS,
        },
        {
            "name": "Application URL",
            "key": "app_url",
            "value": "http://localhost:5173",
            "type": ConfigurationType.SYS,
        },
        {
            "name": "Time Zone",
            "key": "time_zone",
            "value": "Asia/Tokyo",
            "type": ConfigurationType.SYS,
        },
    ]

    dc = DataCreator(session)
    dc.all_if_not_exists(Configuration, configurations)
    session.commit()


def init_features(app: FastAPI, session: Session) -> None:
    features: List[Dict[str, Any]] = []
    for route in app.routes:
        if isinstance(route, BaseRoute):
            features.append(
                {
                    "name": getattr(route, "name"),
                    "description": getattr(route, "description"),
                }
            )

    dc = DataCreator(session)
    dc.all_if_not_exists(Feature, features)
    session.commit()


def init_users(session: Session) -> None:
    users: List[Dict[str, Any]] = [
        {"name": "admin", "password": "<PASSWORD>", "email": "test@test.com"}
    ]

    dc = DataCreator(session)
    dc.all_if_not_exists(User, users)
    session.commit()
