from typing import List
from fastapi import APIRouter, Body, Depends, HTTPException, Query, status

from database import get_db_session
from users.auth.deps import get_user
from users.etudiants.schemas import CreateEtudiantSchema
from .presenter import  ThesisPresenter
from .schemas import CreateThesisSchema, UpdateThesisSchema, AnneeSchema
from sqlalchemy.ext.asyncio import AsyncSession
from .deps import get_limit_offset_annee, get_limit_offset_thesis, response_data, get_user,  get_presenter, \
    get_slug_user, get_thesis_user, get_limit_offset_user, \
    get_create_data_user, get_updated_data_slug_user

thesis_controllers = APIRouter(prefix='/thesis', tags=['thesis'])


@thesis_controllers.get(**response_data.get('all_thesis'))
async def get_all_thesis(
        annee_id: int,
        presenter: ThesisPresenter = Depends(get_presenter),
        limit: int | None = 1000,
        offset: int | None = 0
):
    data: dict = await get_limit_offset_thesis(limit, offset, annee_id)
    return await presenter.get_all_thesis(**data)


@thesis_controllers.get(**response_data.get('thesis'))
async def get_thesis(
    years_id: int,
    utilisateur_id: int,
    presenter: ThesisPresenter = Depends(get_presenter)
    
):
    # data: dict = await get_limit_offset_user(user.id, years_id)
    return await presenter.get_thesis(utilisateur_id=utilisateur_id, years_id=years_id)

@thesis_controllers.post(**response_data.get('create_thesis'))
async def create_thesis(
        thesis_data: CreateThesisSchema,
        matricules: str,  # Les matricules sont envoyés en tant que chaîne, séparés par des virgules
        utilisateur_id: int,
        presenter: ThesisPresenter = Depends(get_presenter),
        db: AsyncSession = Depends(get_db_session)
    ):
    try:
        matricules_list = [m.strip() for m in matricules.split(',')]
        thesis_id = await presenter.create_thesis(utilisateur_id, thesis_data, matricules_list, db)
        return {"thesis_id": thesis_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@thesis_controllers.patch(**response_data.get('update_thesis'))
async def update_thesis(
        updated_data: UpdateThesisSchema,
        thesis_slug: str, utilisateur_id: int,
        presenter: ThesisPresenter = Depends(get_presenter),
):
    data: dict = await get_updated_data_slug_user(
        updated_data, thesis_slug, utilisateur_id)
    return await presenter.update_thesis(**data)

# @thesis_controllers.get(**response_data.get('thesisa'))
# async def get_thesisa(
#         thesis_slug: str,
#         presenter: ThesisPresenter = Depends(get_presenter),
# ):
#     return await presenter.get_thesisa(thesis_slug=thesis_slug)




@thesis_controllers.get(**response_data.get('memorant'))
async def get_all_thesis_with_students(
        annee_id: int,
        presenter: ThesisPresenter = Depends(get_presenter),
        limit: int | None = 1000,
        offset: int | None = 0,
        db: AsyncSession = Depends(get_db_session)
):
    print(f"Controller: annee_id={annee_id}, limit={limit}, offset={offset}")
    try:
        theses_with_students = await presenter.get_all_thesis_with_students(annee_id, limit, offset, db)
        return {'theses_with_students': theses_with_students}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@thesis_controllers.get(**response_data.get('memorant/departement'))
async def get_all_thesis_with_students_by_department(
        annee_id: int,
        departement_id: int,
        presenter: ThesisPresenter = Depends(get_presenter),
        limit: int | None = 1000,
        offset: int | None = 0,
        db: AsyncSession = Depends(get_db_session)
):
    print(f"Controller: annee_id={annee_id}, limit={limit}, offset={offset}")
    try:
        theses_with_students = await presenter.get_all_thesis_with_students_by_department(annee_id,departement_id, limit, offset, db)
        return {'theses_with_students': theses_with_students}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@thesis_controllers.get(**response_data.get('memorant/maitre'))
async def get_thesis_by_maitre(
        annee_id: int,
        maitre_memoire_id: int,
        presenter: ThesisPresenter = Depends(get_presenter),
        limit: int | None = 1000,
        offset: int | None = 0,
        db: AsyncSession = Depends(get_db_session)
):
    print(f"Controller: annee_id={annee_id}, {maitre_memoire_id}, limit={limit}, offset={offset}")
    try:
        theses_with_students = await presenter.get_thesis_by_maitre(annee_id, maitre_memoire_id, limit, offset, db)
        return {'theses_with_students': theses_with_students}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@thesis_controllers.get(**response_data.get('assign_choices'))
async def assign_choices(
        annee_id: int ,
        department_id: int,
        presenter: ThesisPresenter = Depends(get_presenter),
        db: AsyncSession = Depends(get_db_session)
):
    try:
        assigned_choices = await presenter.assign_choices(annee_id,department_id, db)
        return assigned_choices
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@thesis_controllers.get(**response_data.get('planification'))
async def get_planification( 
    annee_id: int,
    department_id: int, 
    presenter: ThesisPresenter = Depends(get_presenter), 
    db: AsyncSession = Depends(get_db_session)
):
    planifications = await presenter.get_planification(annee_id,department_id, db)
    return planifications


@thesis_controllers.get('/get_annees/', response_model=List[AnneeSchema])
async def get_annees(
    presenter: ThesisPresenter = Depends(get_presenter),
    limit: int | None = 1000,
    offset: int | None = 0,
    ):
    try:
        data: dict = await get_limit_offset_annee(limit, offset)
        return await presenter.get_annees(**data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


