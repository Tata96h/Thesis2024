from typing import List, Optional
from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, status, UploadFile, File, Form
from pydantic import BaseModel, ValidationError
import json

from database import get_db_session
from users.auth.deps import get_user
from users.etudiants.schemas import CreateEtudiantSchema
from .presenter import  ThesisPresenter
from .schemas import CreateThesisSchema, PlanificationSchema, UpdateThesisSchema, AnneeSchema
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
    thesis_slug: int = Path(..., title="The ID of the thesis to update"),
    utilisateur_id: int = Query(..., title="The ID of the user"),
    updated_data: str = Form(...),
    fichier: Optional[UploadFile] = File(None),
    presenter: ThesisPresenter = Depends(get_presenter),
):
    try:
        # Convertir updated_data de chaîne JSON en dict
        updated_data_dict = json.loads(updated_data)
        
        # Valider updated_data_dict en utilisant UpdateThesisSchema
        updated_data_obj = UpdateThesisSchema(**updated_data_dict)

        # Vérifiez si `fichier` est une chaîne vide et définissez-le sur None si c'est le cas
        if isinstance(fichier, str):
            fichier = None

        # Appelez la méthode `update_thesis` du présentateur pour gérer la mise à jour
        thesis_id = await presenter.update_thesis(
            utilisateur_id,
            thesis_slug,
            updated_data_obj,
            fichier
        )

        # Retournez l'ID de la thèse mise à jour
        return {"thesis_id": thesis_id}

    except ValidationError as e:
        # Gérez les erreurs de validation Pydantic avec un code HTTP 422
        raise HTTPException(status_code=422, detail=e.errors())

    except Exception as e:
        # Capturez toutes les autres exceptions et renvoyez une réponse HTTP 400
        raise HTTPException(status_code=400, detail=str(e))


    

@thesis_controllers.get(**response_data.get('thesisa'))
async def get_thesisa(
        thesis_slug: int,
        presenter: ThesisPresenter = Depends(get_presenter),
):
    return await presenter.get_thesisa(thesis_slug=thesis_slug)




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
    
@thesis_controllers.get(**response_data.get('memorant/by_id'))
async def get_all_thesis_with_students_by_id(
        annee_id: int,
        utilisateur_id: int,
        presenter: ThesisPresenter = Depends(get_presenter),
        limit: int | None = 1000,
        offset: int | None = 0,
        db: AsyncSession = Depends(get_db_session)
):
    print(f"Controller: annee_id={annee_id},{utilisateur_id}, limit={limit}, offset={offset}")
    try:
        theses_with_students = await presenter.get_all_thesis_with_students_by_id(annee_id, utilisateur_id,limit, offset, db)
        return {'theses_with_students': theses_with_students}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@thesis_controllers.get(**response_data.get('memorant/by_departement'))
async def get_all_thesis_with_students_by_departement(
        annee_id: int,
        departement_id: int,
        presenter: ThesisPresenter = Depends(get_presenter),
        limit: int | None = 1000,
        offset: int | None = 0,
        db: AsyncSession = Depends(get_db_session)
):
    print(f"Controller: annee_id={annee_id}, limit={limit}, offset={offset}")
    try:
        theses_with_students = await presenter.get_all_thesis_with_students_by_departement(annee_id,departement_id, limit, offset, db)
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
        departement_id: int,
        presenter: ThesisPresenter = Depends(get_presenter),
        db: AsyncSession = Depends(get_db_session)
):
    try:
        assigned_choices = await presenter.assign_choices(annee_id,departement_id, db)
        return assigned_choices
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@thesis_controllers.post(**response_data.get('planification'))
async def get_planification( 
    annee_id: int,
    departement_id: int, 
    plan_data: PlanificationSchema,
    presenter: ThesisPresenter = Depends(get_presenter), 
    db: AsyncSession = Depends(get_db_session)
):
    planifications = await presenter.get_planification(annee_id, departement_id, plan_data, db)
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


