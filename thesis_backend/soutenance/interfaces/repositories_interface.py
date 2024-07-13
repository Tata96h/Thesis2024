from abc import ABC, abstractmethod
from typing import Dict, List

from fastapi import UploadFile
from ..schemas import CreateThesisSchema, PlanificationSchema, UpdateThesisSchema
from sqlalchemy.ext.asyncio import AsyncSession

class ThesisRepositoriesInterface(ABC):

   

    @abstractmethod
    async def create_thesis(
            self, matricules: list, thesis_data: CreateThesisSchema):
        pass

    @abstractmethod
    async def get_thesis(self, utilisateur_id: int, years_id: int, limit: int, offset: int, db):
        pass

    @abstractmethod
    async def get_all_thesis(self, annee_id: int, limit: int, offset: int, db):
        pass
    
    @abstractmethod
    async def update_thesis(
            self, utlisateur_id: int, thesis_slug: str, fichier: UploadFile ,
            updated_data: UpdateThesisSchema
    ):
        pass

    @abstractmethod
    async def get_thesisa(self, thesis_slug: int):
        pass
    
    @abstractmethod
    async def get_all_thesis_with_students(self, annee_id: int, limit: int, offset: int, db: AsyncSession):
        pass

    @abstractmethod
    async def get_all_thesis_with_students_by_id(self, annee_id: int, utilisateur_id: int, limit: int, offset: int, db: AsyncSession):
        pass

    @abstractmethod
    async def get_all_thesis_with_students_by_departement(self, annee_id: int,departement_id, limit: int, offset: int, db: AsyncSession):
        pass

    @abstractmethod
    async def get_thesis_by_maitre(self, annee_id: int, maitre_memoire_id: int, limit: int, offset: int, db: AsyncSession):
        pass

    @abstractmethod
    async def assign_choices(self, annee_id: int,departement_id: int,):
        pass

    @abstractmethod
    async def get_planification(self, annee_id: int, plan_data: PlanificationSchema, departement_id: int,):
        pass

    @abstractmethod
    async def get_annees(self, limit: int, offset: int):
        pass
