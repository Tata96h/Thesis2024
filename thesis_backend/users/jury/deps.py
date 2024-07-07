from typing import List
from fastapi import status, Depends
from permissions import UserPermission
from users.auth.password_service import PasswordService
from users.auth.repositories import UserRepositories
from users.auth.token_service import TokenService
from .schemas import JurySchema, CreateJurySchema, UpdateJurySchema
from .repositories import JuryRepositories
from sqlalchemy.ext.asyncio import AsyncSession
from .presenter import JuryPresenter
from database import get_db_session
from passlib.context import CryptContext


# async def get_repository_service(session=Depends(get_db_session)):
#     yield {
#         'repository': ChannelRepositories(session=session)
#     }


async def get_presenter(session=Depends(get_db_session)):
    presenter = JuryPresenter(
        repository=JuryRepositories(session=session))
    yield presenter


async def get_jury_user(jury_id: int) -> dict:
    return {'jury_id': jury_id}


async def get_limit_offset_user( limit: int, offset: int) -> dict:
    return { 'limit': limit, 'offset': offset}


async def get_slug_user(numero: str) -> dict:
    return {'numero': numero}


async def get_updated_data_slug_user(updated_data: UpdateJurySchema,
                                         numero: str,
                                         ) -> dict:
    return {
        'updated_data': updated_data,
        'numero': numero
    }


async def get_create_data_user(
                                   jury_data: CreateJurySchema) -> dict:
    return { 'jury_data': jury_data}


response_data = {
    
    'jurys': {
        'path': '/',
        'status_code': status.HTTP_200_OK,
        
    },
     
    'jurys/departement': {
        'path': '/{departement_id}',
        'status_code': status.HTTP_200_OK,
        
    },
    'create_jurys': {
        'path': '/',
        'status_code': status.HTTP_201_CREATED,
    },
    'delete_jurys': {
        'path': '/{numero}',
        'status_code': status.HTTP_204_NO_CONTENT,
    },
    'update_jury': {
        'path': '/{numero}',
        'status_code': status.HTTP_200_OK,
    },
   'jury': {
        'path': '/{numero}',
        'status_code': status.HTTP_200_OK,
        'response_model': JurySchema
    },
    
}