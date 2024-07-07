from image_service.image_service import ImageService
from .repositories import ProfileRepositories
from fastapi import Depends, status
from database import get_db_session
from permissions import UserPermission
from ..auth.token_service import TokenService
from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import UserSchema
from settings import get_settings


async def get_presenter(session: AsyncSession = Depends(get_db_session)):
    yield {
        'repositories': ProfileRepositories(session=session)
    }



async def get_user_data(
        user=Depends(UserPermission(token_service=TokenService())
                         .get_current_user)
):
    yield user


response_data = {
    'add_image': {
        'path': '/images/{image_name}',
        'status_code': status.HTTP_201_CREATED
    },
    'delete_image': {
        'path': '/images/{image_name}',
        'status_code': status.HTTP_204_NO_CONTENT
    },
    'get_user': {
        'path': '/',
        'status_code': status.HTTP_200_OK,
        'response_model': UserSchema
    },
    'update_user': {
        'path': '/',
        'status_code': status.HTTP_200_OK,
    },
    'delete_user': {
        'path': '/',
        'status_code': status.HTTP_204_NO_CONTENT
    }
}
