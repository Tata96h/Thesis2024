from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

from users.auth.schemas import UsersSchema



class CreateJurySchema(BaseModel):
    departement_id: int
    taille_jury: int  # 2 ou 3


class UpdateJurySchema(BaseModel):
    numero: str
    president_id: int | None
    examinateur_id: int | None
    rapporteur_id: Optional[int] = None

    @property
    def is_empty(self): return not self.dict(exclude_none=True)


class JurySchema(BaseModel):
    id: int
    numero: str
    president_id: int
    examinateur_id: int
    rapporteur_id: int | None
    

    class Config:
        orm_mode = True

