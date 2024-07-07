from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from users.auth.deps import get_user
from users.etudiants.schemas import FiliereSchema
from .presenter import EnseignantPresenter
from .schemas import CreateEnseignantSchema, DepartementSchema, GradeSchema, UpdateEnseignantSchema
from .deps import response_data,  get_presenter, \
    get_slug_user, get_updated_data_slug_user, get_limit_offset_user, \
    get_create_data_user

enseignant_controllers = APIRouter(prefix='/enseignants', tags=['enseignants'])

@enseignant_controllers.get(**response_data.get('enseignants'))
async def get_enseignants(
        limit: int | None = 1000,
        offset: int | None = 0,
        presenter: EnseignantPresenter = Depends(get_presenter),
):
    data: dict = await get_limit_offset_user(limit, offset)
    return await presenter.get_enseignants(**data)

@enseignant_controllers.post(**response_data.get('create_enseignants'))
async def create_enseignant(
        enseignant_data: CreateEnseignantSchema,
        presenter: EnseignantPresenter = Depends(get_presenter),
):
    data: dict = await get_create_data_user(enseignant_data)
    return await presenter.create_enseignant(**data)

@enseignant_controllers.delete(**response_data.get('delete_enseignants'))
async def delete_enseignant(
        matricule: int,
        presenter: EnseignantPresenter = Depends(get_presenter),
):
    data: dict = await get_slug_user(matricule)
    return await presenter.delete_enseignant(**data)

@enseignant_controllers.patch(**response_data.get('update_enseignant'))
async def update_enseignant(
        matricule: int,
        updated_data: UpdateEnseignantSchema,
        presenter: EnseignantPresenter = Depends(get_presenter),
):
    data: dict = await get_updated_data_slug_user(updated_data, matricule)
    return await presenter.update_enseignant(**data)

@enseignant_controllers.get(**response_data.get('enseignant'))
async def get_enseignant(
        utilisateur_id: int,
        presenter: EnseignantPresenter = Depends(get_presenter),
):
    return await presenter.get_enseignant(utilisateur_id=utilisateur_id)

@enseignant_controllers.get(**response_data.get('enseignants_by_matricule'))
async def get_enseignant_by_matricule(
        matricule: int,
        presenter: EnseignantPresenter = Depends(get_presenter),
):
    return await presenter.get_enseignant_by_matricule(matricule=matricule)

@enseignant_controllers.get(**response_data.get('enseignants_by_departement'))
async def get_enseignants_by_departement(
        departement_id: int,
        limit: int | None = 1000,
        offset: int | None = 0,
        presenter: EnseignantPresenter = Depends(get_presenter),
):
    data: dict = await get_limit_offset_user(limit, offset)
    data['departement_id'] = departement_id
    return await presenter.get_enseignants_by_departement(**data)

@enseignant_controllers.get('/get_departements/', response_model=List[DepartementSchema])
async def get_departements(presenter: EnseignantPresenter = Depends(get_presenter)):
    try:
        return await presenter.get_departements()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
@enseignant_controllers.get('/get_grades/', response_model=List[GradeSchema])
async def get_grades(presenter: EnseignantPresenter = Depends(get_presenter)):
    try:
        return await presenter.get_grades()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@enseignant_controllers.get("/departements/{departement_id}/filieres", response_model=List[FiliereSchema])
async def get_filieres_by_departement(
    departement_id: int,
    presenter: EnseignantPresenter = Depends(get_presenter) 
):
    try:
        return await presenter.get_filieres_by_departement(departement_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Filières non trouvé")
    