from typing import List
from fastapi import APIRouter, Depends, File, UploadFile
from .schemas import UpdateUserSchema
from .presenter import ProfilePresenter
from image_service.image_service import ImageService
from .deps import get_user_data, get_presenter
from .deps import response_data
from settings import get_settings

profile_controllers = APIRouter(prefix='/profile', tags=['profile'])


@profile_controllers.post(**response_data.get('add_image'))
async def add_images(
        # images: list[UploadFile] | None = File(None),
        images: List[UploadFile] = File(...),
        presenter_data=Depends(get_presenter),
        user=Depends(get_user_data)
):
    return await ProfilePresenter(**presenter_data).add_images(
        images=images, utilisateur_id=user.id,
        file_service=ImageService(path=get_settings().profile_image_folder)
    )


@profile_controllers.delete(**response_data.get('delete_image'))
async def delete_image(
        image_name: str, presenter_data=Depends(get_presenter),
        user=Depends(get_user_data)
):
    return await ProfilePresenter(**presenter_data).delete_image(
        image_name=image_name, utilisateur_id=user.id,
        image_service=ImageService(path=get_settings().profile_image_folder)
    )


@profile_controllers.get(**response_data.get('get_user'))
async def get_user(user=Depends(get_user_data)):
    return user


@profile_controllers.patch(**response_data.get('update_user'))
async def update_user(
        # updated_data: UpdateUserSchema,
        updated_data: UpdateUserSchema = Depends(UpdateUserSchema.as_form),
        presenter_data=Depends(get_presenter),
        user=Depends(get_user_data)
):
    return await ProfilePresenter(**presenter_data) \
        .update_user(utilisateur_id=user.id, data=updated_data)


@profile_controllers.delete(**response_data.get('delete_user'))
async def delete_user(
        presenter_data=Depends(get_presenter),
        user=Depends(get_user_data)
):
    return await ProfilePresenter(**presenter_data) \
        .delete_user(utilisateur_id=user.id)
