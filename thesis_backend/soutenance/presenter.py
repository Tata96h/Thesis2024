from dataclasses import dataclass
from typing import List, Optional

from fastapi import UploadFile

from file_service.interfaces.file_service_interface import FileServiceInterface
from .schemas import AnneeSchema, CreateThesisSchema, PlanificationSchema, SalleSchema, UpdateThesisSchema
from .interfaces.repositories_interface import \
     ThesisRepositoriesInterface
    
from .exceptions import ThesisExceptions
from sqlalchemy.ext.asyncio import AsyncSession


@dataclass
class ThesisPresenter:
    repository: ThesisRepositoriesInterface

    
    # async def create_thesis(self, thesis_data: CreateThesisSchema, db: AsyncSession):
    #     thesis_id = await self.repository.create_thesis(thesis_data, db)
    #     return {'thesis_id': thesis_id}

    async def get_all_thesis(self, annee_id: int, limit: int, offset: int):
        data = {'annee_id': annee_id, 'limit': limit, 'offset': offset}
        return await self.repository.get_all_thesis(**data)

    async def get_thesis(self, utilisateur_id: int, years_id: int):
        data = {'utilisateur_id': utilisateur_id, 'years_id': years_id}
        return await self.repository.get_thesis(**data)
    
    async def create_thesis(self, utilisateur_id: int, thesis_data: CreateThesisSchema, matricules: list, db: AsyncSession):
        thesis_id = await self.repository.create_thesis(utilisateur_id, thesis_data, matricules, db)
        return thesis_id

    async def get_all_thesis_with_students(self, annee_id: int, limit: int, offset: int, db: AsyncSession):
        print(f"Presenter: Entering function with annee_id={annee_id}, limit={limit}, offset={offset}")
        print(f"Presenter: Repository instance: {self.repository}")
        
        try:
            print("Presenter: Calling repository.get_all_thesis_with_students")
            result = await self.repository.get_all_thesis_with_students(annee_id, limit, offset, db)
            print(f"Presenter: Received result from repository: {result}")
            return result
        except Exception as e:
            print(f"Presenter: Error occurred: {str(e)}")
            raise

    async def get_all_thesis_with_students_by_id(self, annee_id: int, utilisateur_id: int, limit: int, offset: int, db: AsyncSession):
        print(f"Presenter: Entering function with annee_id={annee_id},{utilisateur_id} limit={limit}, offset={offset}")
        print(f"Presenter: Repository instance: {self.repository}")
        
        try:
            print("Presenter: Calling repository.get_all_thesis_with_students")
            result = await self.repository.get_all_thesis_with_students_by_id(annee_id, utilisateur_id, limit, offset, db)
            print(f"Presenter: Received result from repository: {result}")
            return result
        except Exception as e:
            print(f"Presenter: Error occurred: {str(e)}")
            raise

    async def get_all_thesis_with_students_by_departement(self, annee_id: int, departement_id: int,  limit: int, offset: int, db: AsyncSession):
        print(f"Presenter: Entering function with annee_id={annee_id}, departement={departement_id} limit={limit}, offset={offset}")
        print(f"Presenter: Repository instance: {self.repository}")
        
        try:
            print("Presenter: Calling repository.get_all_thesis_with_students")
            result = await self.repository.get_all_thesis_with_students_by_departement(annee_id, departement_id, limit, offset, db)
            print(f"Presenter: Received result from repository: {result}")
            return result
        except Exception as e:
            print(f"Presenter: Error occurred: {str(e)}")
            raise
    
    async def get_thesis_by_maitre(self, annee_id: int, maitre_memoire_id: int, limit: int, offset: int, db: AsyncSession):
        print(f"Presenter: Entering function with annee_id={annee_id}, maitre_memoire_id= {maitre_memoire_id}, limit={limit}, offset={offset}")
        print(f"Presenter: Repository instance: {self.repository}")
        
        try:
            print("Presenter: Calling repository.get_all_thesis_with_students")
            result = await self.repository.get_thesis_by_maitre(annee_id, maitre_memoire_id, limit, offset, db)
            print(f"Presenter: Received result from repository: {result}")
            return result
        except Exception as e:
            print(f"Presenter: Error occurred: {str(e)}")
            raise

    async def update_thesis(
    self, utilisateur_id: int, thesis_slug: int,
    updated_data: UpdateThesisSchema,
    fichier: Optional[UploadFile] = None
):
        if updated_data.is_empty and not fichier:
            raise ThesisExceptions().empty_data
        return await self.repository.update_thesis(
            utilisateur_id, 
            thesis_slug,
            updated_data,
            fichier
        )
    
    async def get_thesisa(self, thesis_slug: int):
        data = {'thesis_slug': thesis_slug}
        if (result := await self.repository.get_thesisa(**data)) is None:
            raise ThesisExceptions().thesis_not_found
        return result
    

    async def assign_choices(self, annee_id: int,departement_id: int, db: AsyncSession):
        print(f"Presenter received annee_id: {annee_id} {departement_id}")
        return await self.repository.assign_choices(annee_id=annee_id,departement_id=departement_id, db=db)
    
    async def get_planification(self, annee_id: int, departement_id: int, plan_data: PlanificationSchema, db: AsyncSession):
        planifications = await self.repository.get_planification(annee_id, departement_id, plan_data, db)
        return planifications

    async def get_annees(self, limit: int, offset: int) -> List[AnneeSchema]:
        annees = await self.repository.get_annees(limit, offset)
        return [AnneeSchema.from_orm(annee) for annee in annees]
    
    async def get_salles(self, limit: int, offset: int) -> List[SalleSchema]:
        salles = await self.repository.get_salles(limit, offset)
        return [SalleSchema.from_orm(salle) for salle in salles]
    
    