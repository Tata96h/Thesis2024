from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from .presenter import JuryPresenter
from .schemas import CreateJurySchema, JurySchema, UpdateJurySchema
from .deps import response_data,  get_presenter, \
    get_slug_user, get_updated_data_slug_user, get_limit_offset_user, \
    get_create_data_user

jury_controllers = APIRouter(prefix='/jurys', tags=['jurys'])

@jury_controllers.get(**response_data.get('jurys'))
async def get_jurys(
        limit: int | None = 1000,
        offset: int | None = 0,
        presenter: JuryPresenter = Depends(get_presenter),
):
    
    data: dict = await get_limit_offset_user(limit, offset)
    return await presenter.get_jurys(**data)

@jury_controllers.get(**response_data.get('jurys/departement'))
async def get_jurys(
        departement_id: int,
        limit: int | None = 1000,
        offset: int | None = 0,
        presenter: JuryPresenter = Depends(get_presenter),
):
    data: dict = await get_limit_offset_user(limit, offset)
    data['departement_id'] = departement_id
    return await presenter.get_jurys_by_departement(**data)
    

@jury_controllers.post(**response_data.get('create_jurys'))
async def create_jury(
        jury_data: CreateJurySchema,
        presenter: JuryPresenter = Depends(get_presenter),
):
    return await presenter.create_jury(jury_data)


@jury_controllers.delete(**response_data.get('delete_jurys'))
async def delete_jury(
        numero: str,
        presenter: JuryPresenter = Depends(get_presenter),
):
    data: dict = await get_slug_user(numero)
    return await presenter.delete_jury(**data)

@jury_controllers.patch(**response_data.get('update_jury'))
async def update_jury(
        numero: str,
        updated_data: UpdateJurySchema,
        presenter: JuryPresenter = Depends(get_presenter),
):
    data: dict = await get_updated_data_slug_user(updated_data, numero)
    return await presenter.update_jury(**data)

@jury_controllers.get(**response_data.get('jury_by_numero'))
async def get_jury(
        numero: str,
        presenter: JuryPresenter = Depends(get_presenter),
):
    return await presenter.get_jury(numero)

