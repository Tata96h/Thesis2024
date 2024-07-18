from dataclasses import dataclass
from typing import List
import random, string
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, AsyncResult
from sqlalchemy import select, insert, delete, update, and_, or_, func
from sqlalchemy.orm import subqueryload, aliased, joinedload
from sqlalchemy.exc import IntegrityError
from database import Base
from users.auth.models import Enseignant, Grade, Jury, Users
from .schemas import CreateJurySchema, JurySchema, UpdateJurySchema
from .exceptions import JuryExceptions
from .interfaces.repositories_interface import JuryRepositoriesInterface
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from itertools import combinations
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
    
    
    ORDRE_GRADES = {
        "Assistant": 1,
        "Attaché de Recherche": 2,
        "Maître-Assistant": 3,
        "Chargé de Recherche": 4,
        "Maître de Conférences": 5,
        "Directeur de Recherche": 6,
        "Professeur Titulaire": 7
    
    }
   


    async def create_jury(self, jury_data: CreateJurySchema):
        if jury_data.taille_jury not in [2, 3]:
            raise ValueError("La taille du jury doit être 2 ou 3.")

        # Récupérer tous les enseignants du département avec leurs grades
        stmt = select(Enseignant).options(joinedload(Enseignant.grade)).filter(Enseignant.departement_id == jury_data.departement_id)
        result = await self.session.execute(stmt)
        enseignants = result.unique().scalars().all()

        if len(enseignants) < jury_data.taille_jury:
            raise ValueError(f"Il n'y a pas assez d'enseignants dans ce département pour former un jury de {jury_data.taille_jury} membres.")

        jurys_crees = []

        # Fonction pour créer un jury
        async def creer_jury(membres):
            # Générer un numéro unique pour le jury
            numero = await self.generate_unique_numero()
            while await self.get_jury(numero):
                numero = await self.generate_unique_numero()

            # Trier les membres par grade (descendant)
            membres_tries = sorted(membres, key=lambda e: self.ORDRE_GRADES.get(e.grade.nom, 0), reverse=True)

            president_id = membres_tries[0].id
            examinateur_id = membres_tries[1].id
            rapporteur_id = membres_tries[2].id if len(membres_tries) > 2 else None

            # Vérifier si un jury avec cette composition existe déjà
            existing_jury_stmt = select(Jury).where(
                Jury.president_id == president_id,
                Jury.examinateur_id == examinateur_id,
                Jury.rapporteur_id == rapporteur_id
            ).limit(1)
            existing_jury_result = await self.session.execute(existing_jury_stmt)
            existing_jury = existing_jury_result.scalar_one_or_none()

            if existing_jury:
                print(f"Le jury avec la composition {[president_id, examinateur_id, rapporteur_id]} existe déjà.")
                return

            # Créer le nouveau jury
            new_jury = Jury(
                numero=numero,
                president_id=president_id,
                examinateur_id=examinateur_id,
                rapporteur_id=rapporteur_id
            )

            try:
                self.session.add(new_jury)
                await self.session.commit()
                jurys_crees.append(numero)
            except IntegrityError:
                await self.session.rollback()
                print(f"Le jury avec la composition {[president_id, examinateur_id, rapporteur_id]} existe déjà.")

        # Créer toutes les combinaisons possibles
        combinaisons = list(combinations(enseignants, jury_data.taille_jury))

        # Créer les jurys
        for combo in combinaisons:
            await creer_jury(combo)

        return {'detail': f'{len(jurys_crees)} jurys créés avec succès: {", ".join(jurys_crees)}'}


                    
    
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
    


    async def get_jury(self, 
            numero: int, 
            
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
            .where(Jury.numero == numero)
            
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
