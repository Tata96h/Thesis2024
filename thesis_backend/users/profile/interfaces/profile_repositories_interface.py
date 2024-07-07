from abc import ABC, abstractmethod

from fastapi import UploadFile

from image_service.interfaces.image_service_interface import \
    ImageServiceInterface
from ..schemas import UpdateUserSchema


class ProfileRepositoriesInterface(ABC):

    @abstractmethod
    async def get_user(self, utilisateur_id: int): pass

    @abstractmethod
    async def update_user(
            self, utilisateur_id: int, data: UpdateUserSchema):
        pass

    @abstractmethod
    async def delete_user(self, utilisateur_id: int): pass

    @abstractmethod
    async def update_profile_image(
            self, images: list[UploadFile] | None,
            utilisateur_id: int, file_service: ImageServiceInterface
    ):
        pass

    @abstractmethod
    async def delete_image(
            self, image_name: str, utilisateur_id: int,
            image_service: ImageServiceInterface
    ):
        pass
