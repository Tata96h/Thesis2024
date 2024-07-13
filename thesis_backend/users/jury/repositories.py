from dataclasses import dataclass
from typing import List
import random, string
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, AsyncResult
from sqlalchemy import select, insert, delete, update, and_, or_
from sqlalchemy.orm import subqueryload, aliased
from database import Base
from users.auth.models import Enseignant, Jury, Users
from .schemas import CreateJurySchema, JurySchema, UpdateJurySchema
from .exceptions import JuryExceptions
from .interfaces.repositories_interface import JuryRepositoriesInterface
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import os

@dataclass
class JuryRepositories(JuryRepositoriesInterface):
    session: AsyncSession
    
    async def get_jurys(self, limit: int, offset: int):
        # Aliases for user tables for president, examinateur, and rapporteur
        president_user = aliased(Users)
        examinateur_user = aliased(Users)
        rapporteur_user = aliased(Users)
        president_enseignant = aliased(Enseignant)
        examinateur_enseignant = aliased(Enseignant)
        rapporteur_enseignant = aliased(Enseignant)

        # Build the query with necessary joins
        stmt = (
            select(
                Jury.id, Jury.numero, Jury.president_id, Jury.examinateur_id, Jury.rapporteur_id,
                president_user.nom.label('president_nom'), president_user.prenoms.label('president_prenom'),
                examinateur_user.nom.label('examinateur_nom'), examinateur_user.prenoms.label('examinateur_prenom'),
                rapporteur_user.nom.label('rapporteur_nom'), rapporteur_user.prenoms.label('rapporteur_prenom')
            )
            .outerjoin(president_enseignant, Jury.president_id == president_enseignant.id)
            .outerjoin(president_user, president_enseignant.utilisateur_id == president_user.id)
            .outerjoin(examinateur_enseignant, Jury.examinateur_id == examinateur_enseignant.id)
            .outerjoin(examinateur_user, examinateur_enseignant.utilisateur_id == examinateur_user.id)
            .outerjoin(rapporteur_enseignant, Jury.rapporteur_id == rapporteur_enseignant.id)
            .outerjoin(rapporteur_user, rapporteur_enseignant.utilisateur_id == rapporteur_user.id)
            .limit(limit)
            .offset(offset)
        )

        result = await self.session.execute(stmt)
        jurys = result.fetchall()

        # Formatting the result
        formatted_jurys = []
        for jury in jurys:
            formatted_jurys.append({
                'id': jury.id,
                'numero': jury.numero,
                'president': {
                    'id': jury.president_id,
                    'nom': jury.president_nom,
                    'prenom': jury.president_prenom
                    
                },
                'examinateur': {
                    'id': jury.examinateur_id,
                    'nom': jury.examinateur_nom,
                    'prenom': jury.examinateur_prenom
                },
                'rapporteur': {
                    'id': jury.rapporteur_id,
                    'nom': jury.rapporteur_nom,
                    'prenom': jury.rapporteur_prenom
                }
            })

        return formatted_jurys

    async def generate_unique_numero(self):
        print("Génération d'un numéro de jury unique...")
        first_letter = random.choice(string.ascii_uppercase)  # Choisir une lettre majuscule
        rest_digits = ''.join(random.choices(string.digits, k=4))  # Choisir 4 chiffres
        numero = first_letter + rest_digits  # Combiner la lettre et les chiffres
        print(f"Numéro de jury généré: {numero}")
        return numero
    
    async def create_jury(self, jury_data: CreateJurySchema):

        # Générer un numéro de jury unique
        numero = await self.generate_unique_numero()
        while await self.get_jury(numero):
            print(f"Le numéro de jury {numero} existe déjà. Génération d'un nouveau numéro...")
            numero = await self.generate_unique_numero()
            print(f"Numéro de jury unique généré: {numero}")
            
        president_id = jury_data.president_id
        examinateur_id = jury_data.examinateur_id
        rapporteur_id = jury_data.rapporteur_id

        # Vérifier si un même ID est utilisé pour plusieurs rôles
        roles = [president_id, examinateur_id, rapporteur_id]
        unique_roles = set(filter(None, roles))
        if len(unique_roles) != len(list(filter(None, roles))):
            raise ValueError("Un même ID ne peut pas être utilisé pour plusieurs rôles dans un jury.")

        # Normaliser les ids pour comparaison
        ids_to_check = sorted(unique_roles)
        print(ids_to_check)

        # Vérifier si un jury avec les mêmes membres existe déjà
        stmt = select(Jury).filter(
            and_(
                or_(Jury.president_id.in_(ids_to_check), Jury.president_id.is_(None)),
                or_(Jury.examinateur_id.in_(ids_to_check), Jury.examinateur_id.is_(None)),
                or_(Jury.rapporteur_id.in_(ids_to_check), Jury.rapporteur_id.is_(None))
            )
        )
        result = await self.session.execute(stmt)
        existing_jurys = result.scalars().all()

        for jury in existing_jurys:
            existing_ids = sorted([id for id in [jury.president_id, jury.examinateur_id, jury.rapporteur_id] if id is not None])
            if existing_ids == ids_to_check:
                raise ValueError(f"Un jury avec la composition {ids_to_check} existe déjà sous le numéro {jury.numero}")

        # Si aucun jury existant avec la même composition, insérer le nouveau jury
        values = {
            'numero': numero,
            'president_id': president_id,
            'examinateur_id': examinateur_id,
        }
        if rapporteur_id is not None:
            values['rapporteur_id'] = rapporteur_id

        stmt = insert(Jury).values(**values).returning(Jury)
        result = await self.session.execute(statement=stmt)
        await self.session.commit()
        return {'detail': f'Jury numéro {numero} créé avec succès'}

    
    
    async def delete_jury(self, numero: str):
        # Récupérer le jury à supprimer
        jury = await self.get_jury(numero)
        if not jury:
            raise JuryExceptions().jury_not_found

        # Supprimer le jury
        stmt = delete(Jury).where(Jury.numero == numero)
        result = await self.session.execute(statement=stmt)
        await self.session.commit()
        return {'detail': f'Jury numéro {numero} supprimé avec succès'}
    
    async def update_jury(self, numero: str, updated_data: UpdateJurySchema):
        await self.__check_jury(numero=numero)
        values = {**updated_data.dict(exclude_none=True)}
        if updated_data.numero:
            values.update({'numero': updated_data.numero})
            stmt = update(Jury).where(Jury.numero == numero).values(**values).returning(Jury)
            result = await self.session.execute(statement=stmt)
        await self.session.commit()
        # return result.scalar_one()
        return {'detail': f'Jury numéro {numero} mise à jour'}
    
    async def get_jury(self, numero: str):
        # Aliases pour les tables utilisateur pour président, examinateur et rapporteur
        president_user = aliased(Users)
        examinateur_user = aliased(Users)
        rapporteur_user = aliased(Users)
        president_enseignant = aliased(Enseignant)
        examinateur_enseignant = aliased(Enseignant)
        rapporteur_enseignant = aliased(Enseignant)

        # Construction de la requête avec les jointures nécessaires
        stmt = (
            select(
                Jury.id, Jury.numero, Jury.president_id, Jury.examinateur_id, Jury.rapporteur_id,
                president_user.nom.label('president_nom'), president_user.prenoms.label('president_prenom'),
                examinateur_user.nom.label('examinateur_nom'), examinateur_user.prenoms.label('examinateur_prenom'),
                rapporteur_user.nom.label('rapporteur_nom'), rapporteur_user.prenoms.label('rapporteur_prenom')
            )
            .outerjoin(president_enseignant, Jury.president_id == president_enseignant.id)
            .outerjoin(president_user, president_enseignant.utilisateur_id == president_user.id)
            .outerjoin(examinateur_enseignant, Jury.examinateur_id == examinateur_enseignant.id)
            .outerjoin(examinateur_user, examinateur_enseignant.utilisateur_id == examinateur_user.id)
            .outerjoin(rapporteur_enseignant, Jury.rapporteur_id == rapporteur_enseignant.id)
            .outerjoin(rapporteur_user, rapporteur_enseignant.utilisateur_id == rapporteur_user.id)
            .where(Jury.numero == numero)
        )

        result = await self.session.execute(stmt)
        row = result.fetchone()

        if not row:
            return None

        # Destructuring des valeurs de row
        (
            jury_id, jury_numero, president_id, examinateur_id, rapporteur_id,
            president_nom, president_prenom, examinateur_nom, examinateur_prenom,
            rapporteur_nom, rapporteur_prenom
        ) = row
        print(row)
        # Construction de l'objet JSON avec les noms et prénoms
        jury_data = {
            'id': jury_id,
            'numero': jury_numero,
            'president_id': president_id,
            'examinateur_id': examinateur_id,
            'rapporteur_id': rapporteur_id,
            'president': {
                'id': president_id,
                'nom': president_nom,
                'prenom': president_prenom
            },
            'examinateur': {
                'id': examinateur_id,
                'nom': examinateur_nom,
                'prenom': examinateur_prenom
            },
            'rapporteur': {
                'id': rapporteur_id,
                'nom': rapporteur_nom,
                'prenom': rapporteur_prenom
            }
        }

        return jury_data


    async def get_jurys_by_departement(self,
    limit: int, 
    offset: int, 
    departement_id: int, 
    
):
        # Aliases for user tables for president, examinateur, and rapporteur
        president_user = aliased(Users)
        examinateur_user = aliased(Users)
        rapporteur_user = aliased(Users)
        president_enseignant = aliased(Enseignant)
        examinateur_enseignant = aliased(Enseignant)
        rapporteur_enseignant = aliased(Enseignant)

        # Build the query with necessary joins and where clause for department filtering
        stmt = (
            select(
                Jury.id.label('jury_id'), Jury.numero, Jury.president_id, Jury.examinateur_id, Jury.rapporteur_id,
                president_user.nom.label('president_nom'), president_user.prenoms.label('president_prenom'),
                examinateur_user.nom.label('examinateur_nom'), examinateur_user.prenoms.label('examinateur_prenom'),
                rapporteur_user.nom.label('rapporteur_nom'), rapporteur_user.prenoms.label('rapporteur_prenom')
            )
            .outerjoin(president_enseignant, Jury.president_id == president_enseignant.id)
            .outerjoin(president_user, president_enseignant.utilisateur_id == president_user.id)
            .outerjoin(examinateur_enseignant, Jury.examinateur_id == examinateur_enseignant.id)
            .outerjoin(examinateur_user, examinateur_enseignant.utilisateur_id == examinateur_user.id)
            .outerjoin(rapporteur_enseignant, Jury.rapporteur_id == rapporteur_enseignant.id)
            .outerjoin(rapporteur_user, rapporteur_enseignant.utilisateur_id == rapporteur_user.id)
            .where(president_enseignant.departement_id == departement_id)
            .limit(limit)
            .offset(offset)
        )

        result = await self.session.execute(stmt)
        jurys = result.fetchall()

        # Formatting the result
        formatted_jurys = []
        for jury in jurys:
            formatted_jurys.append({
                'jury_id': jury.jury_id,
                'numero': jury.numero,
                'president': {
                    'id': jury.president_id,
                    'nom': jury.president_nom,
                    'prenom': jury.president_prenom
                },
                'examinateur': {
                    'id': jury.examinateur_id,
                    'nom': jury.examinateur_nom,
                    'prenom': jury.examinateur_prenom
                },
                'rapporteur': {
                    'id': jury.rapporteur_id,
                    'nom': jury.rapporteur_nom,
                    'prenom': jury.rapporteur_prenom
                }
            })

        # Encodage des données en JSON
        json_compatible_item_data = jsonable_encoder({"jurys": formatted_jurys})
        return JSONResponse(content=json_compatible_item_data)
                        
                    

    async def __check_jury(self, numero: str):
            if not (jury := await self.get_jury(numero=numero)):
                raise JuryExceptions().jury_not_found
            return jury
