from dataclasses import dataclass
from typing import List

from database import AsyncSessionLocal
from users.auth.exceptions import AuthExceptions
from .schemas import JurySchema, UpdateJurySchema, CreateJurySchema
from .interfaces.repositories_interface import JuryRepositoriesInterface
from .exceptions import JuryExceptions
from sqlalchemy.exc import SQLAlchemyError


@dataclass
class JuryPresenter:
    repository: JuryRepositoriesInterface

    async def get_jurys(self,  limit: int, offset: int):
        data = { 'limit': limit, 'offset': offset}
        return await self.repository.get_jurys(**data)


    async def get_jurys_by_departement(self,  limit: int, departement_id: int, offset: int):
        data = { 'limit': limit, 'offset': offset, 'departement_id': departement_id}
        return await self.repository.get_jurys_by_departement(**data)

    async def create_jury(self, jury_data: CreateJurySchema):
        return await self.repository.create_jury(jury_data)



    async def delete_jury(self, numero: str):
        data = { 'numero': numero}
        if not await self.repository.delete_jury(**data):
            raise JuryExceptions().jury_not_found

    async def update_jury(self, numero: str, updated_data: UpdateJurySchema):
        if updated_data.is_empty:
            raise JuryExceptions().empty_data
        return await self.repository.update_jury(
             numero=numero, updated_data=updated_data
        )

    async def get_jury(self, numero: str):
        data = {'numero': numero}
        if (result := await self.repository.get_jury(**data)) is None:
            raise JuryExceptions().jury_not_found
        return result
    
    

    