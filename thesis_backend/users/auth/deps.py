from fastapi import Depends, status

from permissions import UserPermission
from users.enseignants.repositories import EnseignantRepositories
from users.etudiants.repositories import EtudiantRepositories
from .schemas import TokenSchema
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db_session
from .repositories import UserRepositories
from .password_service import PasswordService
from .token_service import TokenService
from settings import get_settings
password_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

async def get_user(
        user=Depends(UserPermission(token_service=TokenService())
                         .get_current_user)
):
    yield user


async def get_option_presenter(session: AsyncSession = Depends(get_db_session)
        ):
    settings = get_settings()
    yield {
        'repository': UserRepositories(session=session),
        'etudiant_repository': EtudiantRepositories(session=session),
        'enseignant_repository': EnseignantRepositories(session=session),
        'password_service': PasswordService(context=password_context),
        'token_service': TokenService(),
        
    }


async def get_token_service_data():
    yield {
        'token_service': TokenService()
    }


response_data = {
    'login': {
        'path': '/login',
        'status_code': status.HTTP_200_OK,
        'response_model': TokenSchema
    },
    'signup': {
        'path': '/signup',
        'status_code': status.HTTP_201_CREATED
    },
    'create_token': {
        'path': '/receive_token',
        'status_code': status.HTTP_201_CREATED,
        'response_model': TokenSchema
    },
   'delete_user': {
        'path': '/',
        'status_code': status.HTTP_204_NO_CONTENT
    }
}
