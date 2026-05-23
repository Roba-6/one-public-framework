from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, File, Path, UploadFile
from fastapi.params import Depends, Query
from starlette.responses import FileResponse

from one_public_api.common import constants
from one_public_api.common.query_param import QueryParam
from one_public_api.common.tools import create_response_data
from one_public_api.core import translate as _
from one_public_api.models import Attachment, User
from one_public_api.routers.base_route import BaseRoute
from one_public_api.schemas.attachment_schema import (
    AttachmentCreateRequest,
    AttachmentPublicResponse,
    AttachmentResponse,
    AttachmentUpdateRequest,
)
from one_public_api.schemas.response_schema import ResponseSchema
from one_public_api.services.attachment_service import AttachmentService
from one_public_api.services.authenticate_service import get_current_user

public_router = APIRouter(route_class=BaseRoute)
admin_router = APIRouter(
    route_class=BaseRoute, dependencies=[Depends(get_current_user)]
)
prefix = constants.ROUTER_PREFIX_ATTACHMENT
tags = [_("Attachments")]

# ----- Public APIs --------------------------------------------------------------------


@public_router.get(
    constants.ROUTER_DOWNLOAD_WITH_ID,
    name="SYS-ATT-P-DWL",
    summary=_("Download Public Attachment"),
    response_class=FileResponse,
)
def download_public_api(
    atts: Annotated[AttachmentService, Depends()],
    target_id: UUID = Path(description=_("The ID of the attachment to be retrieved")),
) -> FileResponse:
    file = atts.get_one_by_id(target_id)
    return FileResponse(path=file.path, filename=file.original_name)


# ----- Admin APIs ---------------------------------------------------------------------


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-ATT-A-LST",
    summary=_("List Attachments"),
    response_model=ResponseSchema[List[AttachmentResponse]],
)
def list_admin_api(
    atts: Annotated[AttachmentService, Depends()],
    query: Annotated[QueryParam, Query()],
) -> ResponseSchema[AttachmentResponse]:
    return create_response_data(
        AttachmentResponse, atts.get_all(query), atts.count, atts.detail
    )


@admin_router.post(
    constants.ROUTER_COMMON_ADMIN,
    name="SYS-ATT-A-ADD",
    summary=_("Create Attachment"),
    response_model=ResponseSchema[List[AttachmentResponse]],
)
def create_admin_api(
    atts: Annotated[AttachmentService, Depends()],
    data: AttachmentCreateRequest,
) -> ResponseSchema[AttachmentResponse]:
    return create_response_data(
        AttachmentResponse,
        atts.add_one(Attachment(**data.model_dump())),
        detail=atts.detail,
    )


@admin_router.get(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-ATT-A-DTL",
    summary=_("Get Attachment"),
    response_model=ResponseSchema[AttachmentResponse],
)
def retrieve_admin_api(
    atts: Annotated[AttachmentService, Depends()],
    target_id: UUID = Path(description=_("The ID of the attachment to be retrieved")),
) -> ResponseSchema[AttachmentResponse]:
    return create_response_data(
        AttachmentResponse, atts.get_one_by_id(target_id), detail=atts.detail
    )


@admin_router.put(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-ATT-A-UPD",
    summary=_("Update Attachment"),
    response_model=ResponseSchema[AttachmentResponse],
)
def update_admin_api(
    atts: Annotated[AttachmentService, Depends()],
    data: AttachmentUpdateRequest,
    target_id: UUID = Path(description=_("The ID of the attachment to be updated")),
) -> ResponseSchema[AttachmentResponse]:
    return create_response_data(
        AttachmentResponse,
        atts.update_one_by_id(target_id, Attachment(**data.model_dump())),
        detail=atts.detail,
    )


@admin_router.delete(
    constants.ROUTER_COMMON_ADMIN_WITH_ID,
    name="SYS-ATT-A-DEL",
    summary=_("Delete Action"),
    response_model=ResponseSchema[AttachmentResponse],
)
def destroy_admin_api(
    atts: Annotated[AttachmentService, Depends()],
    target_id: UUID = Path(description=_("The ID of the attachment to be deleted")),
) -> ResponseSchema[AttachmentResponse]:
    return create_response_data(
        AttachmentResponse, atts.delete_one_by_id(target_id), detail=atts.detail
    )


@admin_router.post(
    constants.ROUTER_UPLOAD_ADMIN,
    name="SYS-ATT-A-UPL",
    summary=_("Upload Attachment"),
    response_model=ResponseSchema[List[AttachmentPublicResponse]],
)
def upload_admin_api(
    current_user: Annotated[User, Depends(get_current_user)],
    atts: Annotated[AttachmentService, Depends()],
    files: List[UploadFile] = File(
        ...,
        title=_("Upload Attachment Files"),
        description=_("Upload multiple attachment files"),
    ),
) -> ResponseSchema[AttachmentPublicResponse]:
    return create_response_data(
        AttachmentResponse,
        atts.upload_files_with_user(files, current_user),
        atts.count,
        atts.detail,
    )


@admin_router.get(
    constants.ROUTER_DOWNLOAD_ADMIN_WITH_ID,
    name="SYS-ATT-A-DWL",
    summary=_("Download Attachment"),
    response_class=FileResponse,
)
def download_admin_api(
    atts: Annotated[AttachmentService, Depends()],
    target_id: UUID = Path(description=_("The ID of the attachment to be downloaded")),
) -> FileResponse:
    file = atts.get_one_by_id(target_id)
    return FileResponse(path=file.path, filename=file.original_name)
