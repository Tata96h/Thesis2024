from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime

from users.auth.schemas import UsersSchema


class CreateEtudiantSchema(BaseModel):
    username: str
    password: Optional[str] = Field(None)
    nom: str
    prenoms: str
    matricule: Optional[int]
    filiere_id: int
    
    

class UpdateEtudiantSchema(BaseModel):
    matricule: int 
    filiere_id: int | None
    # nom: str  = Field(None, max_length=200)
    # prenoms: str = Field(None, max_length=200)
   

    @property
    def is_empty(self): return not self.dict(exclude_none=True)


class FiliereSchema(BaseModel):
    id: int
    nom: str
    departement_id: int

    class Config:
        orm_mode=True

class EtudiantSchema(BaseModel):
    id: int
    matricule: int
    slug: Optional[int]
    utilisateur_id: int
    filiere_id: int
    created: datetime
    utilisateur: UsersSchema
    filiere: FiliereSchema  

    class Config:
        orm_mode=True



class EmailSchema(BaseModel):
    username: List[EmailStr]

    class Config:
        orm_mode=True
    

class RoleSchema(BaseModel):
    id: int
    libelle: str

    class Config:
        orm_mode=True
