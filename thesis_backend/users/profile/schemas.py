from datetime import datetime
from typing import Optional
from fastapi import Form

from pydantic import BaseModel, Field

from users.enseignants.schemas import EnseignantSchema
from users.etudiants.schemas import EtudiantSchema


class UserImageSchema(BaseModel):
    id: int
    photo: str
    utilisateur_id: int

    class Config:
        orm_mode = True


class UpdateUserSchema(BaseModel):
    bio: str | None = Field(None, max_length=255)
    username: str | None = Field(None, max_length=200)

    @classmethod
    def as_form(
        cls, bio: str | None = Form(None),
        username: str | None = Form(None)
    ):
        return cls(bio=bio, username=username)


class UserSchema(UpdateUserSchema):
    nom: str
    prenoms: str
    role_id: int
    id: int
    created: datetime
    is_active: bool = Field(True)
    images: list[UserImageSchema]
    matricule: Optional[str] = None
    filiere: Optional[str] = None
    grade: Optional[str] = None
    departement: Optional[str] = None
    slug: Optional[str] = None
    

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda d: d.strftime('%Y-%m-%d %H:%M')
        }
