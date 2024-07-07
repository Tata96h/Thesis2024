from abc import ABC, abstractmethod
from ..schemas import CreateEnseignantSchema,  UpdateEnseignantSchema


class EnseignantRepositoriesInterface(ABC):

    @abstractmethod
    async def get_enseignants(self, utilisateur_id: int, limit: int, offset: int):
        pass

    @abstractmethod
    async def get_departements(self, limit: int, offset: int):
        pass

    @abstractmethod
    async def get_grades(self, limit: int, offset: int):
        pass

    @abstractmethod
    async def get_enseignants_by_departement(self, departement_id: int, limit: int, offset: int):
        pass

    @abstractmethod
    async def get_filieres_by_departement(self, departement_id: int, limit: int, offset: int):
        pass


    @abstractmethod
    async def create_enseignant(
            self, utilisateur_id: int, enseignant_data: CreateEnseignantSchema):
        pass

    @abstractmethod
    async def delete_enseignant(self, utilisateur_id: int, enseignant_slug: int):
        pass

    @abstractmethod
    async def update_enseignant(self, utilisateur_id: int, enseignant_slug: int,updated_data: UpdateEnseignantSchema):
        pass

    @abstractmethod
    async def get_enseignant(self, utilisateur_id: int):
        pass

    @abstractmethod
    async def get_enseignant_by_matricule(self, matricule: int):
        pass
    
    