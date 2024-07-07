from abc import ABC, abstractmethod
from ..schemas import CreateEtudiantSchema, UpdateEtudiantSchema


class EtudiantRepositoriesInterface(ABC):

    @abstractmethod
    async def get_etudiants(self, utilisateur_id: int, limit: int, offset: int):
        pass

    @abstractmethod
    async def get_filieres(self, limit: int, offset: int):
        pass

    @abstractmethod
    async def get_roles(self, limit: int, offset: int):
        pass

    @abstractmethod
    async def get_role_by_id(self, id: int):
        pass

    @abstractmethod
    async def create_etudiant(
            self, etudiant_data: CreateEtudiantSchema):
        pass

    @abstractmethod
    async def delete_etudiant(self, utilisateur_id: int, etudiant_slug: int):
        pass
    @abstractmethod
    async def update_etudiant(
            self, utilisateur_id: int, etudiant_slug: int,
            updated_data: UpdateEtudiantSchema
    ):
        pass

    @abstractmethod
    async def get_etudiant(self, utilisateur_id: int):
        pass

    @abstractmethod
    async def get_etudiant_by_matricule(self, matricule: int):
        pass

    @abstractmethod
    async def get_etudiants_by_filiere(self, filiere_id: int, limit: int, offset: int):
        pass

    @abstractmethod
    async def get_etudiants_by_departement(self, departement_id: int, limit: int, offset: int):
        pass

    
    