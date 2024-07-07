from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

from users.auth.schemas import UsersSchema



class CreateEnseignantSchema(BaseModel):
    username: str
    password:  Optional[str] = Field(None)
    nom: str
    prenoms: str
    matricule: Optional[int]
    grade_id: int
    departement_id: int 
    
    


class UpdateEnseignantSchema(BaseModel):
    matricule: int
    grade: str | None = Field(None, max_length=255)

    @property
    def is_empty(self): return not self.dict(exclude_none=True)

class DepartementSchema(BaseModel):
    id: int
    nom: str 
    
    class Config:
        orm_mode = True

class GradeSchema(BaseModel):
    id: int
    nom: str 
    
    class Config:
        orm_mode = True

# class EnseignantSchema(BaseModel):
#     id: int
#     matricule: int
#     slug: Optional[str]
#     utilisateur_id: int
#     grade_id: int
#     departement_id: int
#     created: datetime
#     utilisateur: UsersSchema
#     grade: GradeSchema
#     departement: DepartementSchema

#     class Config:
#         orm_mode = True

class EnseignantSchema(BaseModel):
    id: int
    matricule: int
    slug: Optional[int]
    utilisateur_id: int
    grade_id: int
    departement_id: int
    created: datetime
    utilisateur: UsersSchema
    grade: GradeSchema
    departement: DepartementSchema

    class Config:
        orm_mode = True



        