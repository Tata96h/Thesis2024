from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from users.auth.deps import get_user
from .presenter import EtudiantPresenter
from .schemas import CreateEtudiantSchema, EtudiantSchema, FiliereSchema, RoleSchema, UpdateEtudiantSchema
from .deps import response_data,  get_presenter, \
    get_slug_user, get_updated_data_slug_user, get_limit_offset_user, \
    get_create_data_user

etudiant_controllers = APIRouter(prefix='/etudiants', tags=['etudiants'])



@etudiant_controllers.get(**response_data.get('etudiants'))
async def get_etudiants(
        limit: int | None = 1000,
        offset: int | None = 0,
        presenter: EtudiantPresenter = Depends(get_presenter),
):
    data: dict = await get_limit_offset_user(limit, offset)
    return await presenter.get_etudiants(**data)

@etudiant_controllers.post(**response_data.get('create_etudiants'))
async def create_etudiant(
        etudiant_data: CreateEtudiantSchema,
        presenter: EtudiantPresenter = Depends(get_presenter),
):
    data: dict = await get_create_data_user(etudiant_data)
    return await presenter.create_etudiant(**data)

@etudiant_controllers.delete(**response_data.get('delete_etudiants'))
async def delete_etudiant(
        matricule: int,
        presenter: EtudiantPresenter = Depends(get_presenter),
):
    data: dict = await get_slug_user(matricule)
    return await presenter.delete_etudiant(**data)

@etudiant_controllers.patch(**response_data.get('update_etudiant'))
async def update_etudiant(
        matricule: int,
        updated_data: UpdateEtudiantSchema,
        presenter: EtudiantPresenter = Depends(get_presenter),
):
    data: dict = await get_updated_data_slug_user(updated_data, matricule)
    return await presenter.update_etudiant(**data)

@etudiant_controllers.get(**response_data.get('etudiant'))
async def get_etudiant(
        utilisateur_id: int,
        presenter: EtudiantPresenter = Depends(get_presenter),
):
    return await presenter.get_etudiant(utilisateur_id=utilisateur_id)

@etudiant_controllers.get(**response_data.get('etudiants_by_matricule'))
async def get_etudiant_by_matricule(
        matricule: int,
        presenter: EtudiantPresenter = Depends(get_presenter),
):
    return await presenter.get_etudiant_by_matricule(matricule=matricule)

@etudiant_controllers.get(**response_data.get('etudiants_by_filiere'))
async def get_etudiants_by_filiere(
        filiere_id: int,
        limit: int | None = 1000,
        offset: int | None = 0,
        presenter: EtudiantPresenter = Depends(get_presenter),
):
    data: dict = await get_limit_offset_user(limit, offset)
    data['filiere_id'] = filiere_id
    return await presenter.get_etudiants_by_filiere(**data)

@etudiant_controllers.get(**response_data.get('etudiants_by_departement'))
async def get_etudiants_by_departement(
        departement_id: int,
        limit: int | None = 1000,
        offset: int | None = 0,
        presenter: EtudiantPresenter = Depends(get_presenter),
):
    data: dict = await get_limit_offset_user(limit, offset)
    data['departement_id'] = departement_id
    return await presenter.get_etudiants_by_departement(**data)


@etudiant_controllers.get('/get_filieres/', response_model=List[FiliereSchema])
async def get_filieres(
    presenter: EtudiantPresenter = Depends(get_presenter),
    limit: int | None = 1000,
    offset: int | None = 0,
    ):
    try:
        data: dict = await get_limit_offset_user(limit, offset)
        return await presenter.get_filieres(**data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
@etudiant_controllers.get('/get_roles/', response_model=List[RoleSchema])
async def get_roles(
    presenter: EtudiantPresenter = Depends(get_presenter),
    limit: int | None = 1000,
    offset: int | None = 0,
    ):
    try:
        data: dict = await get_limit_offset_user(limit, offset)
        return await presenter.get_roles(**data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@etudiant_controllers.get('/get_role_by_id/', response_model=List[RoleSchema])
async def get_role_by_id(
    id: int,
    presenter: EtudiantPresenter = Depends(get_presenter)
    ):
    try:
        return await presenter.get_role_by_id(id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))



