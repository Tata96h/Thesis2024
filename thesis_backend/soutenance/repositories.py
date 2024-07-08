from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, time, timedelta
import random
from typing import Dict, List, Optional
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession, AsyncResult
from sqlalchemy import select, insert, delete, update, and_
from sqlalchemy.orm import subqueryload, aliased
from sqlalchemy.orm.exc import NoResultFound
import string,random
from users.auth.models import Annee, Departement, Enseignant, Etudiant, Filiere, Jury, Planification, Salle, Users
from users.etudiants.schemas import CreateEtudiantSchema
from .schemas import CreateThesisSchema, CreateThesisSchema, UpdateThesisSchema
from users.auth.models import  Appartenir, Thesis
from .exceptions import ThesisExceptions
from .interfaces.repositories_interface import \
    ThesisRepositoriesInterface
from sqlalchemy import exists
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


@dataclass
class ThesisRepositories(ThesisRepositoriesInterface):
    session: AsyncSession

    async def get_all_thesis(self, annee_id: int, limit: int, offset: int):
        stmt = (
            select(Thesis)
            .where(Thesis.annee_id == annee_id)
            .limit(limit)
            .offset(offset)
            .order_by(Thesis.created.desc())
        )
        print(annee_id)
        result = await self.session.execute(statement=stmt)
        theses = result.scalars().all()
        print(f"Fetched theses: {theses}")  
        return theses

    async def get_thesis(self, utilisateur_id: int, years_id: int):
        print(utilisateur_id)
        print(years_id)
        try:
            # Récupérer l'ID de l'étudiant associé à l'utilisateur
            # stmt = select(Etudiant.id).join(Users, Users.id == Etudiant.utilisateur_id).where(
            #     Users.id == utilisateur_id
            # )
            # etudiant_id_result = await self.session.execute(stmt)
            # etudiant_id = etudiant_id_result.scalar_one()
            # print(f"Etudiant ID associé à l'utilisateur {utilisateur_id}: {etudiant_id}")

            # Récupérer les IDs des soutenances associées à cet étudiant
            soutenance_ids_stmt = select(Appartenir.soutenance_id).where(Appartenir.utilisateur_id == utilisateur_id)
            soutenance_ids_result = await self.session.execute(soutenance_ids_stmt)
            soutenance_ids = [row[0] for row in soutenance_ids_result.fetchall()]
            print(soutenance_ids)

            if not soutenance_ids:
                print("Aucune soutenance trouvée pour l'étudiant spécifié.")
                return []

            print(f"Soutenance IDs associés à la soutenance: {soutenance_ids}")

            # Récupérer les thèses correspondantes
            thesis_stmt = select(Thesis).where(
                and_(
                    Thesis.id.in_(soutenance_ids),
                    Thesis.annee_id == years_id
                )
            ).order_by(Thesis.created.desc())

            thesis_result = await self.session.execute(thesis_stmt)
            theses = thesis_result.scalars().all()
            print(theses)

            if not theses:
                print("Aucune thèse trouvée pour les critères spécifiés.")

            return theses

        except NoResultFound:
            print(f"Aucun étudiant trouvé pour l'utilisateur {utilisateur_id}.")
            raise HTTPException(status_code=404, detail=f"Aucun étudiant trouvé pour l'utilisateur {utilisateur_id}.")

        except Exception as e:
            print(f"Erreur lors de l'exécution de la requête : {e}")
            raise HTTPException(status_code=500, detail="Erreur interne du serveur")

    async def generate_unique_numero(self):
        print("Génération d'un numero unique...")
        first_digit = random.choice(string.digits[1:])  # Choisit un chiffre de 1 à 9
        rest_digits = ''.join(random.choices(string.digits, k=3))
        numero = int(first_digit + rest_digits)  # Convertir en entier
        print(f"Matricule généré: {numero}")
        return numero

    async def get_thesisa(self, thesis_slug: int):
        stmt = select(Thesis).where(Thesis.slug == thesis_slug)
        result: AsyncResult = await self.session.execute(statement=stmt)
        return result.scalars().first()

    

    async def create_thesis(self, utilisateur_id: int, thesis_data: CreateThesisSchema, matricules: List[str], session: AsyncSession):
        try:
            # Générer un numéro unique
            numero = await self.generate_unique_numero()
            while await self.get_thesisa(numero):
                print(f"Le numero {numero} existe déjà. Génération d'un nouveau numero...")
                numero = await self.generate_unique_numero()
            print(f"Numero unique généré: {numero}")

            # Récupérer le matricule de l'utilisateur
            utilisateur_matricule_stmt = select(Etudiant.matricule).where(Etudiant.utilisateur_id == utilisateur_id)
            utilisateur_matricule_result = await session.execute(utilisateur_matricule_stmt)
            utilisateur_matricule = utilisateur_matricule_result.scalar()

            # Vérifier que utilisateur_matricule est non nul et bien une chaîne
            if utilisateur_matricule is None:
                raise ValueError("Le matricule de l'utilisateur n'a pas été trouvé.")
            utilisateur_matricule = str(utilisateur_matricule).strip()
            print(f"Utilisateur matricule: '{utilisateur_matricule}' (type: {type(utilisateur_matricule)})")

            # Normaliser la liste des matricules et les convertir en entier
            matricules = [int(m) for m in matricules]
            print(f"Matricules normalisés: {matricules} (types: {[type(m) for m in matricules]})")

            # Vérifier si le matricule de l'utilisateur est dans la liste des matricules envoyée par le front-end
            if int(utilisateur_matricule) not in matricules:
                raise ValueError("Le matricule de l'utilisateur connecté n'est pas présent dans la liste des matricules fournie.")

            # Récupérer les IDs des utilisateurs pour chaque matricule
            etudiant_ids_stmt = select(Etudiant.utilisateur_id).where(Etudiant.matricule.in_(matricules))
            etudiant_ids_result = await session.execute(etudiant_ids_stmt)
            utilisateur_ids = [row[0] for row in etudiant_ids_result.fetchall()]
            print(f"Utilisateur IDs: {utilisateur_ids} (types: {[type(uid) for uid in utilisateur_ids]})")

            if not utilisateur_ids:
                raise ValueError("Un ou plusieurs matricules sont invalides.")

            # Créer la thèse
            values = {
                'numero': numero,
                'slug': numero, 
                **thesis_data.dict(exclude_unset=True)
            }
            print(values)

            thesis_stmt = insert(Thesis).values(**values).returning(Thesis.id)
            result = await session.execute(thesis_stmt)
            thesis_id = result.scalar()
            print(f"Soutenance créée avec succès, ID: {thesis_id}")

            # Ajouter les owner_ids dans la table de jonction
            for utilisateur_id in utilisateur_ids:
                thesis_annee_id_stmt = select(Thesis.annee_id).where(Thesis.id == thesis_id)
                thesis_annee_id_result = await session.execute(thesis_annee_id_stmt)
                thesis_annee_id = thesis_annee_id_result.scalar()

                appartenir_exist_stmt = select(exists().where(
                    Appartenir.utilisateur_id == utilisateur_id
                ).where(
                    Thesis.id == Appartenir.soutenance_id
                ).where(
                    Thesis.annee_id == thesis_annee_id
                ))
                appartenir_exist_result = await session.execute(appartenir_exist_stmt)

                if appartenir_exist_result.scalar():
                    raise ValueError(f"L'utilisateur avec le matricule est déjà associé à une autre thèse pour la même année académique.")

                appartenir_stmt = insert(Appartenir).values(utilisateur_id=utilisateur_id, soutenance_id=thesis_id)
                await session.execute(appartenir_stmt)

            await session.commit()
            print("La thèse et les associations ont été créées avec succès.")
            return thesis_id

        except Exception as e:
            await session.rollback()
            print(f"Une erreur s'est produite : {e}")
            raise e



    async def get_etudiant_ids(self, session, matricules: list[str]):
        stmt = (
            select(Etudiant.id, Etudiant.matricule)
            .where(Etudiant.matricule.in_(matricules))
            .order_by(Etudiant.matricule)
        )
        result = await session.execute(stmt)
        etudiant_ids = {row.matricule: row.id for row in result}
        return etudiant_ids
    
    async def update_thesis(
            self, utilisateur_id: int, thesis_slug: str,
            updated_data: UpdateThesisSchema
    ):
        await self.__check_thesis(thesis_slug=thesis_slug)
        values = {**updated_data.dict(exclude_none=True)}
        if updated_data.numero:
            values.update({'slug': updated_data.numero})
        cond = (Thesis.slug == thesis_slug, Thesis.owner_id == utilisateur_id)
        stmt = update(Thesis).where(*cond).values(**values)
        await self.session.execute(statement=stmt)
        await self.session.commit()
    
    
    async def __check_thesis(self, thesis_slug: str):
        if not (thesis := await self.get_thesisa(thesis_slug=thesis_slug)):
            raise ThesisExceptions().thesis_not_found
        return thesis

    async def get_all_thesis_with_students(self, annee_id: int, limit: int, offset: int, db: AsyncSession):
        print("Entering get_all_thesis_with_students function")
        print(f"Received annee_id: {annee_id}")

        if not isinstance(annee_id, int):
            raise ValueError(f"annee_id must be an integer, received: {type(annee_id)}")

        try:
            # Aliases for user tables for choice1, choice2 and maitre
            choix1_user = aliased(Users)
            choix2_user = aliased(Users)
            maitre_user = aliased(Users)
            choix1_enseignant = aliased(Enseignant)
            choix2_enseignant = aliased(Enseignant)
            maitre_enseignant = aliased(Enseignant)

            # Build the query with necessary joins
            stmt = (
                select(
                    Thesis.id.label('thesis_id'), Thesis.theme, Thesis.is_theme_valide, Thesis.choix1_id, Thesis.choix2_id, Thesis.annee_id, Thesis.maitre_memoire_id, 
                    Appartenir.utilisateur_id, Users.nom.label('etudiant_nom'), Users.prenoms.label('etudiant_prenom'),
                    choix1_user.nom.label('choix1_nom'), choix1_user.prenoms.label('choix1_prenom'),
                    choix2_user.nom.label('choix2_nom'), choix2_user.prenoms.label('choix2_prenom'),
                    maitre_user.nom.label('maitre_nom'), maitre_user.prenoms.label('maitre_prenom')
                )
                .join(Appartenir, Thesis.id == Appartenir.soutenance_id)
                .join(Users, Appartenir.utilisateur_id == Users.id)
                .outerjoin(choix1_enseignant, Thesis.choix1_id == choix1_enseignant.id)
                .outerjoin(choix1_user, choix1_enseignant.utilisateur_id == choix1_user.id)
                .outerjoin(choix2_enseignant, Thesis.choix2_id == choix2_enseignant.id)
                .outerjoin(choix2_user, choix2_enseignant.utilisateur_id == choix2_user.id)
                .outerjoin(maitre_enseignant, Thesis.maitre_memoire_id == maitre_enseignant.id)
                .outerjoin(maitre_user, maitre_enseignant.utilisateur_id == maitre_user.id)
                .where(Thesis.annee_id == annee_id)
                .limit(limit)
                .offset(offset)
            )

            result = await db.execute(stmt)
            print(f"SQL Query executed. Result: {result}")

            if result is None:
                raise Exception("Database execution returned None")

            # Aggregating results
            thesis_dict = {}
            all_results = result.all()
            print(f"Number of results: {len(all_results)}")

            if not all_results:
                raise Exception(f"No results found for annee_id: {annee_id}")

            for row in all_results:
                thesis_id = row.thesis_id
                if thesis_id not in thesis_dict:
                    thesis_dict[thesis_id] = {
                        'thesis_id': thesis_id,
                        'theme': row.theme,
                        'validation': row.is_theme_valide,
                        'choix1': {
                            'id': row.choix1_id,
                            'nom': row.choix1_nom,
                            'prenom': row.choix1_prenom
                        },
                        'choix2': {
                            'id': row.choix2_id,
                            'nom': row.choix2_nom,
                            'prenom': row.choix2_prenom
                        },
                        'annee_id': row.annee_id,
                        'maitre_memoire': {
                            'id': row.maitre_memoire_id,
                            'nom': row.maitre_nom,
                            'prenom': row.maitre_prenom
                        },
                        'etudiants': []
                    }
                thesis_dict[thesis_id]['etudiants'].append({
                    'etudiant_id': row.utilisateur_id,
                    'nom': row.etudiant_nom,
                    'prenom': row.etudiant_prenom
                })

            if not thesis_dict:
                raise Exception(f"No theses found after processing for annee_id: {annee_id}")

            return list(thesis_dict.values())

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            raise
        
    

    async def get_all_thesis_with_students_by_id(self, annee_id: int, utilisateur_id: int, limit: int, offset: int, db: AsyncSession):
        print(f"Recherche de thèses pour annee_id: {annee_id}, utilisateur_id: {utilisateur_id}")

        if not isinstance(annee_id, int):
            raise ValueError(f"annee_id doit être un entier, reçu: {type(annee_id)}")

        try:
            # Alias pour les tables utilisateurs pour choix1, choix2 et maitre
            choix1_user = aliased(Users)
            choix2_user = aliased(Users)
            maitre_user = aliased(Users)
            choix1_enseignant = aliased(Enseignant)
            choix2_enseignant = aliased(Enseignant)
            maitre_enseignant = aliased(Enseignant)

            # Construction de la requête avec les jointures nécessaires
            stmt = (
                select(
                    Thesis.id.label('thesis_id'), Thesis.theme, Thesis.choix1_id, Thesis.is_theme_valide, 
                    Thesis.choix2_id, Thesis.annee_id, Thesis.maitre_memoire_id, 
                    Appartenir.utilisateur_id, Users.nom.label('etudiant_nom'), Users.prenoms.label('etudiant_prenom'),
                    choix1_user.nom.label('choix1_nom'), choix1_user.prenoms.label('choix1_prenom'),
                    choix2_user.nom.label('choix2_nom'), choix2_user.prenoms.label('choix2_prenom'),
                    maitre_user.nom.label('maitre_nom'), maitre_user.prenoms.label('maitre_prenom')
                )
                .join(Appartenir, Thesis.id == Appartenir.soutenance_id)
                .join(Users, Appartenir.utilisateur_id == Users.id)
                .outerjoin(choix1_enseignant, Thesis.choix1_id == choix1_enseignant.id)
                .outerjoin(choix1_user, choix1_enseignant.utilisateur_id == choix1_user.id)
                .outerjoin(choix2_enseignant, Thesis.choix2_id == choix2_enseignant.id)
                .outerjoin(choix2_user, choix2_enseignant.utilisateur_id == choix2_user.id)
                .outerjoin(maitre_enseignant, Thesis.maitre_memoire_id == maitre_enseignant.id)
                .outerjoin(maitre_user, maitre_enseignant.utilisateur_id == maitre_user.id)
                .where(Thesis.annee_id == annee_id)
                .limit(limit)
                .offset(offset)
            )

            result = await db.execute(stmt)
            all_results = result.all()
            print(f"Nombre de résultats: {len(all_results)}")

            if not all_results:
                return JSONResponse(content={"theses_with_students": []})

            thesis_dict = {}
            for row in all_results:
                thesis_id = row.thesis_id
                if thesis_id not in thesis_dict:
                    thesis_dict[thesis_id] = {
                        'thesis_id': thesis_id,
                        'theme': row.theme,
                        'validation': row.is_theme_valide,
                        'choix1': {
                            'id': row.choix1_id,
                            'nom': row.choix1_nom,
                            'prenom': row.choix1_prenom
                        },
                        'choix2': {
                            'id': row.choix2_id,
                            'nom': row.choix2_nom,
                            'prenom': row.choix2_prenom
                        },
                        'annee_id': row.annee_id,
                        'maitre_memoire': {
                            'id': row.maitre_memoire_id,
                            'nom': row.maitre_nom,
                            'prenom': row.maitre_prenom
                        },
                        'etudiants': []
                    }
                thesis_dict[thesis_id]['etudiants'].append({
                    'etudiant_id': row.utilisateur_id,
                    'nom': row.etudiant_nom,
                    'prenom': row.etudiant_prenom
                })

            # Filtrer les thèses pour inclure uniquement celles où utilisateur_id est un des étudiants
            filtered_theses = [
                thesis for thesis in thesis_dict.values() 
                if any(etudiant['etudiant_id'] == utilisateur_id for etudiant in thesis['etudiants'])
            ]

            result_json = {
                "theses_with_students": filtered_theses
            }

            json_compatible_item_data = jsonable_encoder(result_json)
            return JSONResponse(content=json_compatible_item_data)

        except Exception as e:
            print(f"Une erreur s'est produite: {str(e)}")
            raise


    async def get_all_thesis_with_students_by_department(self, annee_id: int, department_id: int, limit: int, offset: int, db: AsyncSession):
        print("Entering get_all_thesis_with_students_by_department function")
        print(f"Received annee_id: {annee_id}, department_id: {department_id}")

        if not isinstance(annee_id, int) or not isinstance(department_id, int):
            raise ValueError(f"annee_id and department_id must be integers, received: {type(annee_id)}, {type(department_id)}")

        try:
            # Aliases for user tables for choice1, choice2 and maitre
            choix1_user = aliased(Users)
            choix2_user = aliased(Users)
            maitre_user = aliased(Users)
            choix1_enseignant = aliased(Enseignant)
            choix2_enseignant = aliased(Enseignant)
            maitre_enseignant = aliased(Enseignant)
            filiere_alias = aliased(Filiere)
            etudiant_alias = aliased(Etudiant)
            appartenir_alias = aliased(Appartenir)

            # Build the query with necessary joins
            stmt = (
                select(
                    Thesis.id.label('thesis_id'), Thesis.theme, Thesis.choix1_id, Thesis.choix2_id, Thesis.annee_id, Thesis.maitre_memoire_id, 
                    Appartenir.utilisateur_id, Users.nom.label('etudiant_nom'), Users.prenoms.label('etudiant_prenom'),
                    choix1_user.nom.label('choix1_nom'), choix1_user.prenoms.label('choix1_prenom'),
                    choix2_user.nom.label('choix2_nom'), choix2_user.prenoms.label('choix2_prenom'),
                    maitre_user.nom.label('maitre_nom'), maitre_user.prenoms.label('maitre_prenom')
                )
                .join(Appartenir, Thesis.id == Appartenir.soutenance_id)
                .join(Users, Appartenir.utilisateur_id == Users.id)
                .outerjoin(choix1_enseignant, Thesis.choix1_id == choix1_enseignant.id)
                .outerjoin(choix1_user, choix1_enseignant.utilisateur_id == choix1_user.id)
                .outerjoin(choix2_enseignant, Thesis.choix2_id == choix2_enseignant.id)
                .outerjoin(choix2_user, choix2_enseignant.utilisateur_id == choix2_user.id)
                .outerjoin(maitre_enseignant, Thesis.maitre_memoire_id == maitre_enseignant.id)
                .outerjoin(maitre_user, maitre_enseignant.utilisateur_id == maitre_user.id)
                .join(etudiant_alias, Appartenir.utilisateur_id == etudiant_alias.utilisateur_id)
                .join(filiere_alias, etudiant_alias.filiere_id == filiere_alias.id)
                .join(Departement, filiere_alias.departement_id == Departement.id)
                .where(Thesis.annee_id == annee_id)
                .where(Departement.id == department_id)
                .limit(limit)
                .offset(offset)
            )

            result = await db.execute(stmt)
            print(f"SQL Query executed. Result: {result}")

            if result is None:
                raise Exception("Database execution returned None")

            # Aggregating results
            thesis_dict = {}
            all_results = result.all()
            print(f"Number of results: {len(all_results)}")

            if not all_results:
                raise Exception(f"No results found for annee_id: {annee_id} and department_id: {department_id}")

            for row in all_results:
                thesis_id = row.thesis_id
                if thesis_id not in thesis_dict:
                    thesis_dict[thesis_id] = {
                        'thesis_id': thesis_id,
                        'theme': row.theme,
                        'choix1': {
                            'id': row.choix1_id,
                            'nom': row.choix1_nom,
                            'prenom': row.choix1_prenom
                        },
                        'choix2': {
                            'id': row.choix2_id,
                            'nom': row.choix2_nom,
                            'prenom': row.choix2_prenom
                        },
                        'annee_id': row.annee_id,
                        'maitre_memoire': {
                            'id': row.maitre_memoire_id,
                            'nom': row.maitre_nom,
                            'prenom': row.maitre_prenom
                        },
                        'etudiants': []
                    }
                thesis_dict[thesis_id]['etudiants'].append({
                    'etudiant_id': row.utilisateur_id,
                    'nom': row.etudiant_nom,
                    'prenom': row.etudiant_prenom
                })

            if not thesis_dict:
                raise Exception(f"No theses found after processing for annee_id: {annee_id} and department_id: {department_id}")

            return list(thesis_dict.values())

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            raise


    async def get_thesis_by_maitre(self, annee_id: int, maitre_memoire_id: int, limit: int, offset: int, db: AsyncSession):
        print("Entering get_thesis_by_maitre function")
        print(f"Received annee_id: {annee_id}, maitre_memoire_id: {maitre_memoire_id}")

        if not isinstance(annee_id, int):
            raise ValueError(f"annee_id must be an integer, received: {type(annee_id)}")

        if not isinstance(maitre_memoire_id, int):
            raise ValueError(f"maitre_memoire_id must be an integer, received: {type(maitre_memoire_id)}")

        try:
            # Aliases for user tables for choice1, choice2 and maitre
            choix1_user = aliased(Users)
            choix2_user = aliased(Users)
            maitre_user = aliased(Users)
            choix1_enseignant = aliased(Enseignant)
            choix2_enseignant = aliased(Enseignant)
            maitre_enseignant = aliased(Enseignant)

            # Build the query with necessary joins
            stmt = (
                select(
                    Thesis.id.label('thesis_id'), Thesis.theme, Thesis.choix1_id, Thesis.choix2_id, Thesis.annee_id, Thesis.maitre_memoire_id, 
                    Appartenir.utilisateur_id, Users.nom.label('etudiant_nom'), Users.prenoms.label('etudiant_prenom'),
                    choix1_user.nom.label('choix1_nom'), choix1_user.prenoms.label('choix1_prenom'),
                    choix2_user.nom.label('choix2_nom'), choix2_user.prenoms.label('choix2_prenom'),
                    maitre_user.nom.label('maitre_nom'), maitre_user.prenoms.label('maitre_prenom')
                )
                .join(Appartenir, Thesis.id == Appartenir.soutenance_id)
                .join(Users, Appartenir.utilisateur_id == Users.id)
                .outerjoin(choix1_enseignant, Thesis.choix1_id == choix1_enseignant.id)
                .outerjoin(choix1_user, choix1_enseignant.utilisateur_id == choix1_user.id)
                .outerjoin(choix2_enseignant, Thesis.choix2_id == choix2_enseignant.id)
                .outerjoin(choix2_user, choix2_enseignant.utilisateur_id == choix2_user.id)
                .outerjoin(maitre_enseignant, Thesis.maitre_memoire_id == maitre_enseignant.id)
                .outerjoin(maitre_user, maitre_enseignant.utilisateur_id == maitre_user.id)
                .where(Thesis.annee_id == annee_id)
                .where(Thesis.maitre_memoire_id == maitre_memoire_id)  # Filtre pour maitre_memoire_id
                .limit(limit)
                .offset(offset)
            )

            result = await db.execute(stmt)
            print(f"SQL Query executed. Result: {result}")

            if result is None:
                raise Exception("Database execution returned None")

            # Aggregating results
            thesis_dict = {}
            all_results = result.all()
            print(f"Number of results: {len(all_results)}")

            if not all_results:
                raise Exception(f"No results found for annee_id: {annee_id} and maitre_memoire_id: {maitre_memoire_id}")

            for row in all_results:
                thesis_id = row.thesis_id
                if thesis_id not in thesis_dict:
                    thesis_dict[thesis_id] = {
                        'thesis_id': thesis_id,
                        'theme': row.theme,
                        'choix1': {
                            'id': row.choix1_id,
                            'nom': row.choix1_nom,
                            'prenom': row.choix1_prenom
                        },
                        'choix2': {
                            'id': row.choix2_id,
                            'nom': row.choix2_nom,
                            'prenom': row.choix2_prenom
                        },
                        'annee_id': row.annee_id,
                        'maitre_memoire': {
                            'id': row.maitre_memoire_id,
                            'nom': row.maitre_nom,
                            'prenom': row.maitre_prenom
                        },
                        'etudiants': []
                    }
                thesis_dict[thesis_id]['etudiants'].append({
                    'etudiant_id': row.utilisateur_id,
                    'nom': row.etudiant_nom,
                    'prenom': row.etudiant_prenom
                })

            if not thesis_dict:
                raise Exception(f"No theses found after processing for annee_id: {annee_id} and maitre_memoire_id: {maitre_memoire_id}")

            return list(thesis_dict.values())

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            raise
    

    

    async def assign_choices(self, annee_id: int, department_id: int, db: AsyncSession) -> List[Dict[str, int]]:
        print(f"Received annee_id: {annee_id}, department_id: {department_id}")
        
        if not isinstance(annee_id, int) or not isinstance(department_id, int):
            raise ValueError(f"annee_id and department_id must be integers, received: {type(annee_id)}, {type(department_id)}")

        try:
            # 1. Utiliser get_all_thesis_with_students_by_department pour récupérer les thèses par département et année
            theses_choices = await self.get_all_thesis_with_students_by_department(annee_id, department_id, limit=1000, offset=0, db=db)
            print(theses_choices)

            if not theses_choices:
                raise ValueError(f"Aucune soutenance trouvée avec des choix non attribués pour l'année {annee_id} et le département {department_id}.")

            # 2. Récupérer la liste des enseignants disponibles
            stmt = select(Enseignant.id)
            result = await db.execute(stmt)
            advisors = [row[0] for row in result.fetchall()]
            print(advisors)

            if not advisors:
                raise ValueError("Aucun enseignant disponible pour l'attribution.")

            # 3. Créer un dictionnaire pour suivre le nombre de thèses attribuées à chaque enseignant
            advisor_load = defaultdict(int)

            assigned_choices = []

            # 4. Calculer le nombre maximal de soutenances par enseignant pour équilibrer la charge
            max_load_per_advisor = len(theses_choices) // len(advisors)
            extra_load = len(theses_choices) % len(advisors)

            # 5. Trier les thèses par choix1_id puis choix2_id
            theses_choices.sort(key=lambda x: (x['choix1']['id'], x['choix2']['id']))

            # 6. Attribuer les enseignants aux thèses en fonction des choix et de la charge actuelle
            for thesis in theses_choices:
                thesis_id = thesis['thesis_id']
                choix1_id = thesis['choix1']['id']
                choix2_id = thesis['choix2']['id']
                assigned = False

                # Essayez d'attribuer le choix 1 s'il est disponible et n'est pas surchargé
                if choix1_id in advisors and advisor_load[choix1_id] < max_load_per_advisor + (1 if extra_load > 0 else 0):
                    maitre_memoire = choix1_id
                    assigned = True
                # Sinon, essayez d'attribuer le choix 2 s'il est disponible et n'est pas surchargé
                elif choix2_id in advisors and advisor_load[choix2_id] < max_load_per_advisor + (1 if extra_load > 0 else 0):
                    maitre_memoire = choix2_id
                    assigned = True
                # Sinon, attribuez l'enseignant avec la charge la plus faible
                if not assigned:
                    maitre_memoire = min(advisors, key=lambda x: advisor_load[x])

                # Mettre à jour la charge de l'enseignant
                advisor_load[maitre_memoire] += 1
                if advisor_load[maitre_memoire] > max_load_per_advisor:
                    extra_load -= 1

                # Mettre à jour la soutenance avec le choix attribué
                update_stmt = update(Thesis).where(Thesis.id == thesis_id).values(maitre_memoire_id=maitre_memoire)
                await db.execute(update_stmt)
                await db.commit()

                assigned_choices.append({'soutenance_id': thesis_id, 'maitre_memoire': maitre_memoire})

            return {"assigned_choices": assigned_choices}

        except Exception as e:
            raise ValueError(f"Une erreur s'est produite lors de l'attribution des choix : {str(e)}")



    

    async def get_planification(self, annee_id: int, departement_id: int, db: AsyncSession):
        theses = await self.get_all_thesis_with_students_by_department(annee_id, departement_id, limit=1000, offset=0, db=db)
        
        rooms_stmt = select(Salle)
        result = await db.execute(rooms_stmt)
        rooms = result.scalars().all()
        
        jurys_stmt = (
        select(Jury)
        .outerjoin(Enseignant, Jury.president_id == Enseignant.id)
        .where(Enseignant.departement_id == departement_id)
        )
        result = await db.execute(jurys_stmt)
        jurys = result.scalars().all()

        if len(rooms) == 0 or len(jurys) == 0:
            raise Exception("Pas assez de ressources disponibles pour la planification.")

        start_date = datetime(2024, 9, 14).date()

        planifications = await self.schedule_defenses(theses, rooms, jurys, start_date, annee_id, departement_id, db)
        return planifications

    async def schedule_defenses(self, theses, rooms, jurys, start_date, annee_id: int, departement_id: int, db: AsyncSession):
        schedules = []
        time_slots = ['8h-9h', '9h-10h', '10h-11h', '11h-12h', '12h-13h', '15h-16h', '16h-17h', '17h-18h', '18h-19h']
        
        theses.sort(key=lambda t: t['thesis_id'])
        current_date = start_date
        thesis_index = 0

        existing_planifications = await db.execute(
            select(Planification).where(Planification.annee_id == annee_id)
        )
        existing_planifications = existing_planifications.scalars().all()

        while thesis_index < len(theses):
            for time_slot in time_slots:
                available_rooms = rooms.copy()
                available_jurys = jurys.copy()

                while available_rooms and available_jurys and thesis_index < len(theses):
                    thesis = theses[thesis_index]

                    # Trouver une salle disponible
                    room = next((r for r in available_rooms if not any(
                        p.date == current_date.strftime('%Y-%m-%d') and
                        p.heure == time_slot and
                        p.salle == r.libelle
                        for p in existing_planifications
                    )), None)

                    if not room:
                        break  # Aucune salle disponible pour ce créneau

                    # Trouver un jury disponible
                    jury = next((j for j in available_jurys if not any(
                        p.date == current_date.strftime('%Y-%m-%d') and
                        p.heure == time_slot and
                        p.jury == str(j.numero)
                        for p in existing_planifications
                    )), None)

                    if not jury:
                        break  # Aucun jury disponible pour ce créneau

                    # Collect student names and surnames
                    etudiants = [f"{etudiant['prenom']} {etudiant['nom']}" for etudiant in thesis['etudiants']]
                    etudiant1 = etudiants[0] if len(etudiants) > 0 else None
                    etudiant2 = etudiants[1] if len(etudiants) > 1 else None

                    schedule_entry = {
                        'thesis_id': thesis['thesis_id'],
                        'theme': str(thesis['theme']),
                        'jury': str(jury.numero),
                        'date': current_date.strftime('%Y-%m-%d'),
                        'heure': time_slot,
                        'salle': room.libelle,
                        'etudiant1': etudiant1,
                        'etudiant2': etudiant2,
                        'annee_id': annee_id,
                        'departement_id': departement_id
                    }

                    new_planification = Planification(**schedule_entry)
                    db.add(new_planification)
                    schedules.append(schedule_entry)
                    existing_planifications.append(new_planification)

                    available_rooms.remove(room)
                    available_jurys.remove(jury)
                    thesis_index += 1

            if thesis_index < len(theses):
                current_date += timedelta(days=1)
            else:
                break

        await db.commit()
        return schedules



    async def get_annees(self, limit: int, offset: int):
        stmt = select(Annee) \
            .limit(limit) \
            .offset(offset)
        result = await self.session.execute(stmt)
        return result.scalars().all()
