from dataclasses import dataclass

from fastapi import UploadFile

from image_service.interfaces.image_service_interface import ImageServiceInterface
from .interfaces.profile_repositories_interface import ProfileRepositoriesInterface
from .schemas import UpdateUserSchema


@dataclass
class ProfilePresenter:
    repositories: ProfileRepositoriesInterface

    async def get_user(self, utilisateur_id: int,):
        print(f"get_user_data called with utilisateur_id: {utilisateur_id}")
        user = await self.get_user(utilisateur_id)
        if user:
            print("User data retrieved in dependency:", user)
        else:
            print("No user found in dependency with id:", utilisateur_id)
        return user

    async def update_user(self, utilisateur_id: int, data: UpdateUserSchema):
        return await self.repositories.update_user(
            utilisateur_id=utilisateur_id, data=data)

    async def delete_user(self, utilisateur_id: int):
        return await self.repositories.delete_user(utilisateur_id=utilisateur_id)

    async def delete_image(
            self, image_name: str, utilisateur_id: int,
            image_service: ImageServiceInterface
    ):
        return await self.repositories.delete_image(
            image_name=image_name, utilisateur_id=utilisateur_id,
            image_service=image_service
        )

    async def add_images(self, images: list[UploadFile] | None, utilisateur_id: int,
                         file_service: ImageServiceInterface):
        await self.repositories \
            .update_profile_image(images=images, utilisateur_id=utilisateur_id,
                                  file_service=file_service)
