from typing import List
from fastapi import status, Depends
from permissions import UserPermission
from users.auth.password_service import PasswordService
from users.auth.repositories import UserRepositories
from users.auth.token_service import TokenService
from users.etudiants.schemas import FiliereSchema
from .schemas import DepartementSchema, EnseignantSchema, CreateEnseignantSchema, GradeSchema, UpdateEnseignantSchema
from .repositories import EnseignantRepositories
from sqlalchemy.ext.asyncio import AsyncSession
from .presenter import EnseignantPresenter
from database import get_db_session
from passlib.context import CryptContext


# async def get_repository_service(session=Depends(get_db_session)):
#     yield {
#         'repository': ChannelRepositories(session=session)
#     }


async def get_presenter(
    session: AsyncSession = Depends(get_db_session)
):
    user_repository = UserRepositories(session=session)
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    password_service = PasswordService(context=pwd_context)
    presenter = EnseignantPresenter(
        repository=EnseignantRepositories(session=session),
        user_repository=user_repository,
        password_service=password_service
    )
    yield presenter


async def get_enseignant_user(enseignant_id: int) -> dict:
    return {'enseignant_id': enseignant_id}


async def get_limit_offset_user( limit: int, offset: int) -> dict:
    return { 'limit': limit, 'offset': offset}


async def get_slug_user(enseignant_slug: str) -> dict:
    return {'enseignant_slug': enseignant_slug}


async def get_updated_data_slug_user(updated_data: UpdateEnseignantSchema,
                                         enseignant_slug: str,
                                         ) -> dict:
    return {
        'updated_data': updated_data,
        'enseignant_slug': enseignant_slug
    }


async def get_create_data_user(
                                   enseignant_data: CreateEnseignantSchema) -> dict:
    return { 'enseignant_data': enseignant_data}


response_data = {
    
    'enseignants': {
        'path': '/',
        'status_code': status.HTTP_200_OK,
        # 'response_model': list[ChannelSchema]
    },
    'create_enseignants': {
        'path': '/',
        'status_code': status.HTTP_201_CREATED,
    },
    'delete_enseignants': {
        'path': '/{matricule}',
        'status_code': status.HTTP_204_NO_CONTENT,
    },
    'update_enseignant': {
        'path': '/{matricule}',
        'status_code': status.HTTP_200_OK,
    },
   'enseignant': {
        'path': '/{utlisateur_id}',
        'status_code': status.HTTP_200_OK,
        'response_model': EnseignantSchema
    },
    'enseignants_by_matricule': {
        'path': '/by_matricule/{matricule}',
        # 'response_model': List[EnseignantSchema],
    },
    
    'enseignants_by_departement': {
        'path': '/by-departement/{departement_id}',
        'response_model': List[EnseignantSchema],
    },
    'get_departements': {
        'path': '/get_departements/',
        'response_model': List[DepartementSchema]
    },
    'get_grades': {
        'path': '/get_grades/',
        'response_model': List[GradeSchema]
    },
    'filieres_by_departement': {
        'path': '/departements/{departement_id}/filieres',
        'response_model': List[FiliereSchema],
    },
}