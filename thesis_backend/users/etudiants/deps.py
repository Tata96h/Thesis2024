from typing import List
from fastapi import status, Depends
from permissions import UserPermission
from users.auth.password_service import PasswordService
from users.auth.repositories import UserRepositories
from users.auth.token_service import TokenService
from .schemas import EtudiantSchema, CreateEtudiantSchema, FiliereSchema, RoleSchema, UpdateEtudiantSchema
from .repositories import EtudiantRepositories
from sqlalchemy.ext.asyncio import AsyncSession
from .presenter import EtudiantPresenter
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
    presenter = EtudiantPresenter(
        repository=EtudiantRepositories(session=session),
        user_repository=user_repository,
        password_service=password_service
    )
    yield presenter


async def get_etudiant_user(etudiant_id: int) -> dict:
    return {'etudiant_id': etudiant_id}


async def get_limit_offset_user( limit: int, offset: int) -> dict:
    return { 'limit': limit, 'offset': offset}


async def get_slug_user(etudiant_slug: str) -> dict:
    return {'etudiant_slug': etudiant_slug}


async def get_updated_data_slug_user(updated_data: UpdateEtudiantSchema,
                                         etudiant_slug: str,
                                         ) -> dict:
    return {
        'updated_data': updated_data,
        'etudiant_slug': etudiant_slug
    }


async def get_create_data_user(
                                   etudiant_data: CreateEtudiantSchema) -> dict:
    return { 'etudiant_data': etudiant_data}


response_data = {
    
    'etudiants': {
        'path': '/',
        'status_code': status.HTTP_200_OK,
        # 'response_model': list[ChannelSchema]
    },
    'create_etudiants': {
        'path': '/',
        'status_code': status.HTTP_201_CREATED,
    },
    'delete_etudiants': {
        'path': '/{matricule}',
        'status_code': status.HTTP_204_NO_CONTENT,
    },
    'update_etudiant': {
        'path': '/{matricule}',
        'status_code': status.HTTP_200_OK,
    },
   'etudiant': {
        'path': '/{utilisateur_id}',
        'status_code': status.HTTP_200_OK,
        'response_model': EtudiantSchema
    },
    'etudiants_by_matricule': {
        'path': '/by-matricule/{matricule}',
        # 'response_model': List[EtudiantSchema],
    },
    'etudiants_by_filiere': {
        'path': '/by-filiere/{filiere_id}',
        'response_model': List[EtudiantSchema],
    },
        'etudiants_by_departement': {
        'path': '/by-departement/{departement_id}',
        'response_model': List[EtudiantSchema],
    },
    'get_filieres': {
        'path': '/get_filieres/',
        'response_model': List[FiliereSchema]
    },
    'get_roles': {
        'path': '/roles/',
        'response_model': List[RoleSchema]
    },
    'get_role_by_id': {
        'path': '/roles/{id}',
        'response_model': List[RoleSchema],
    },
}