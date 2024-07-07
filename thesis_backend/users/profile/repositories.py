import uuid
from dataclasses import dataclass
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, insert
from sqlalchemy.orm import joinedload
from image_service.interfaces.image_service_interface import \
    ImageServiceInterface
from ..auth.models import Enseignant, Etudiant, Users, UserImage
from .schemas import UpdateUserSchema
from .interfaces.profile_repositories_interface import \
    ProfileRepositoriesInterface
from .exceptions import ProfileExceptions
import aiohttp # type: ignore
from settings import get_settings


@dataclass
class ProfileRepositories(ProfileRepositoriesInterface):
    session: AsyncSession

    async def update_profile_image(
            self, images: list[UploadFile] | None,
            utilisateur_id: int,
            file_service: ImageServiceInterface
    ):
        if images:
            for image in images:
                filename = f'{uuid.uuid4()}.{image.filename}'
                await file_service.write_image(file=image, filename=filename)
                stmt = insert(UserImage) \
                    .values(photo=filename, utilisateur_id=utilisateur_id)
                await self.session.execute(statement=stmt)
                await self.session.commit()
                raise ProfileExceptions().image_created
            
    async def delete_image(
            self, image_name: str, utilisateur_id: int,
            image_service: ImageServiceInterface
    ):
        await image_service.delete_image(filename=image_name)
        cond = (UserImage.photo == image_name,
                UserImage.utilisateur_id == utilisateur_id)
        stmt = delete(UserImage).where(*cond)
        await self.session.execute(statement=stmt)
        await self.session.commit()
        raise ProfileExceptions().image_delete

    async def get_user(self, utilisateur_id: int):
        print(f"get_user called with utilisateur_id: {utilisateur_id}")
        
        stmt = (
            select(Users)
            .options(
                joinedload(Users.etudiant).joinedload(Etudiant.filiere),
                joinedload(Users.enseignant).joinedload(Enseignant.grade),
                joinedload(Users.enseignant).joinedload(Enseignant.departement)
            )
            .where(Users.id == utilisateur_id)
        )
        print(f"SQL statement: {stmt}")
        
        result = await self.session.execute(statement=stmt)
        user = result.scalars().first()

        if user:
            print("User found:", user)
            print("User's role_id:", user.role_id)
            
            user_data = {
                "bio": user.bio,
                "username": user.username,
                "nom": user.nom,
                "prenoms": user.prenoms,
                "role_id": user.role_id,
                "id": user.id,
                "created": user.created.strftime('%Y-%m-%d %H:%M'),
                "is_active": user.is_active,
                "images": user.images,
                "matricule": None,
                "filiere": None,
                "grade": None,
                "departement": None,
                "slug": None
            }

            if user.role_id == 1 and user.etudiant:
                print("User is a student. Fetching student details...")
                user_data.update({
                    "matricule": user.etudiant.matricule,
                    "filiere": user.etudiant.filiere.name if user.etudiant.filiere else None,
                    "slug": user.etudiant.slug
                })
                print("Student details:", user_data)
            
            if user.role_id == 2 and user.enseignant:
                print("User is a teacher. Fetching teacher details...")
                user_data.update({
                    "matricule": user.enseignant.matricule,
                    "grade": user.enseignant.grade.name if user.enseignant.grade else None,
                    "departement": user.enseignant.departement.name if user.enseignant.departement else None,
                    "slug": user.enseignant.slug
                })
                print("Teacher details:", user_data)
            
            return user_data
        else:
            print("No user found with id:", utilisateur_id)
        return None


    async def __check_username_exists(self, username: str | None = None):
        if username:
            username_stmt = select(Users.id) \
                .where(Users.username == username)
            check_user = await self.session \
                .execute(statement=username_stmt)
            if check_user.first():
                raise ProfileExceptions().username_exists

    @staticmethod
    async def __create_new_token(username: str):
        async with aiohttp.ClientSession() as session:
            options = {
                'url': get_settings().base_url + '/auth/receive_token/',
                'json': {'username': username}
            }
            async with session.post(**options) as response:
                if response.status == 201:
                    return await response.json()

    async def update_user(self, utilisateur_id: int,
                              data: UpdateUserSchema):
        print(data)
        await self.__check_username_exists(username=data.username)
        upd_stmt = update(Users) \
            .where(Users.id == utilisateur_id) \
            .values(**data.dict(exclude_none=True)) \
            .returning(Users)
        _ = await self.session.execute(statement=upd_stmt)
        await self.session.commit()
        print(data.username)
        if data.username:
            user = await self.get_user(utilisateur_id=utilisateur_id)
            print(user)
            return await self.__create_new_token(username=user.username)
        return {'detail': f'User {utilisateur_id} mise à jour'}

    async def delete_user(self, utilisateur_id: int):
        stmt = delete(Users).where(Users.id == utilisateur_id)
        _ = await self.session.execute(statement=stmt)
        await self.session.commit()
        return {'detail': f'User {utilisateur_id} supprimé'}
