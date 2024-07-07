from abc import ABC, abstractmethod
from ..schemas import CreateJurySchema, UpdateJurySchema


class JuryRepositoriesInterface(ABC):

    @abstractmethod
    async def get_jurys(self, limit: int, offset: int):
        pass
    
    @abstractmethod
    async def get_jurys_by_departement(self, departement_id: int, limit: int, offset: int):
        pass

    @abstractmethod
    async def create_jury(
            self, jury_data: CreateJurySchema):
        pass

    @abstractmethod
    async def delete_jury(self, numero: str):
        pass

    @abstractmethod
    async def update_jury(
            self, numero: str,
            updated_data: UpdateJurySchema
    ):
        pass

    @abstractmethod
    async def get_jury(self, numero: str):
        pass

    