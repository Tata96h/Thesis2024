from typing import List
from fastapi import status, Depends
from permissions import UserPermission
from users.auth.token_service import TokenService
from .schemas import AnneeSchema, AssignChoicesSchema, ThesisSchema, CreateThesisSchema, UpdateThesisSchema
from .repositories import ThesisRepositories

from .presenter import ThesisPresenter
from database import get_db_session


async def get_user(
        user=Depends(UserPermission(token_service=TokenService())
                         .get_current_user)
):
    yield user



async def get_presenter(session=Depends(get_db_session)):
    presenter = ThesisPresenter(
        repository=ThesisRepositories(session=session))
    yield presenter


async def get_thesis_user(thesis_id: int, utilisateur_id: int) -> dict:
    return {'thesis_id': thesis_id, 'utilisateur_id': utilisateur_id}

async def get_limit_offset_annee( limit: int, offset: int) -> dict:
    return { 'limit': limit, 'offset': offset}

async def get_limit_offset_user(utilisateur_id, limit, offset, years_id) -> dict:
    return {'utilisateur_id': utilisateur_id, 'limit': limit, 'years_id': years_id, 'offset': offset}

async def get_limit_offset_thesis( limit, offset, annee_id) -> dict:
    return {'limit': limit, 'annee_id': annee_id, 'offset': offset}


async def get_slug_user(thesis_slug: str, utilisateur_id: int) -> dict:
    return {'thesis_slug': thesis_slug, 'utilisateur_id': utilisateur_id}


async def get_updated_data_slug_user(updated_data: UpdateThesisSchema,
                                         thesis_slug: str,
                                         utilisateur_id: int) -> dict:
    return {
        'updated_data': updated_data,
        'thesis_slug': thesis_slug,
        'utilisateur_id': utilisateur_id
    }


async def get_create_data_user(utilisateur_id: int,
                                   thesis_data: CreateThesisSchema) -> dict:
    return {'utilisateur_id': utilisateur_id, 'thesis_data': thesis_data}


response_data = {
    
    'all_thesis': {
        'path': '/{annee_id}',
        'status_code': status.HTTP_200_OK,
        # 'response_model': list[ChannelSchema]
    },
    'thesis': {
        'path': '/',
        'status_code': status.HTTP_200_OK,
        
    },
    'memorant': {
        'path': '/memorant/{annee_id}',
        'status_code': status.HTTP_200_OK,
        
    },
    'memorant/departement': {
    'path': '/memorant/{annee_id}/{departement}',
    'status_code': status.HTTP_200_OK,
        
    },
    'memorant/maitre': {
        'path': '/memorant/{annee_id}/{maitre_memoire_id}',
        'status_code': status.HTTP_200_OK,
        
    },
    

    'create_thesis': {
        'path': '/',
        'status_code': status.HTTP_201_CREATED,
    },
    'update_thesis': {
        'path': '/{thesis_slug}',
        'status_code': status.HTTP_200_OK,
    },
    # 'thesisa': {
    #     'path': '/{thesis_slug}',
    #     'status_code': status.HTTP_200_OK,
    #     'response_model': ThesisSchema
    # },
    'assign_choices': {
        'path': '/choice/{annee_id}/{department_id}',
        'status_code': status.HTTP_200_OK,
        'response_model': AssignChoicesSchema
    },
    'planification': {
        'path': '/planification/{annee_id}/{department_id}',
        'status_code': status.HTTP_200_OK,
        # 'response_model': AssignChoicesSchema
    },
    'get_annees': {
        'path': '/get_filieres/',
        'response_model': List[AnneeSchema]
    },
}
