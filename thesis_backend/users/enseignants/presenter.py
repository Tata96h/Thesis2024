from dataclasses import dataclass
from datetime import datetime, timedelta
import secrets,random,string
from typing import List
from sqlalchemy import select
from database import AsyncSessionLocal
from users.auth.exceptions import AuthExceptions
from users.auth.interfaces.password_service_interface import PasswordServiceInterface
from users.auth.interfaces.repositories_interface import UserRepositoriesInterface
from users.auth.models import Role
from users.auth.service_email import send_email
from users.etudiants.exceptions import EtudiantExceptions
from users.etudiants.schemas import FiliereSchema
from .schemas import DepartementSchema, EnseignantSchema, GradeSchema, UpdateEnseignantSchema, CreateEnseignantSchema
from .interfaces.repositories_interface import EnseignantRepositoriesInterface
from .exceptions import EnseignantExceptions
from sqlalchemy.exc import SQLAlchemyError


@dataclass
class EnseignantPresenter:
    repository: EnseignantRepositoriesInterface
    user_repository: UserRepositoriesInterface
    password_service: PasswordServiceInterface

    async def get_enseignants(self,  limit: int, offset: int):
        data = { 'limit': limit, 'offset': offset}
        return await self.repository.get_enseignants(**data)

    async def generate_unique_matricule(self):
        print("Génération d'un matricule unique...")
        first_digit = random.choice(string.digits[1:])  # Choisit un chiffre de 1 à 9
        rest_digits = ''.join(random.choices(string.digits, k=7))
        matricule = int(first_digit + rest_digits)  # Convertir en entier
        print(f"Matricule généré: {matricule}")
        return matricule
    
    async def get_role_id_by_libelle(self, libelle: str) -> int:
        async with AsyncSessionLocal() as session:
            stmt = select(Role).filter_by(libelle=libelle)
            result = await session.execute(stmt)
            role = result.scalar_one_or_none()
            if role:
                return role.id
            else:
                raise ValueError(f"Rôle avec libellé {libelle} introuvable")
            
    async def create_enseignant(self, enseignant_data: CreateEnseignantSchema):
        async with AsyncSessionLocal() as session:
            utilisateur_id = None  # Initialiser utilisateur_id à None
            try:
                async with session.begin_nested():
                    # Vérifier si l'utilisateur existe déjà
                    if await self.user_repository.receive_user_by_username(username=enseignant_data.username):
                        raise AuthExceptions().username_exists
                    
                    # Générer un matricule unique
                    matricule = await self.generate_unique_matricule()
                    while await self.repository.get_enseignant_by_matricule(matricule):
                        print(f"Le matricule {matricule} existe déjà. Génération d'un nouveau matricule...")
                        matricule = await self.generate_unique_matricule()
                    print(f"Matricule unique généré: {matricule}")


                    role_id = await self.get_role_id_by_libelle(libelle='Enseignant')
                    
                    # Générer un token de réinitialisation
                    token = secrets.token_urlsafe(32)
                    token_expires = datetime.utcnow() + timedelta(hours=24)
                    password= None

                    # Hacher le mot de passe
                    # hashed_password = await self.password_service.hashed_password(password=enseignant_data.password)

                    # Enregistrer l'utilisateur et récupérer l'utilisateur_id
                    utilisateur_id = await self.user_repository.save_user(
                        username=enseignant_data.username,
                        password=password,
                        nom=enseignant_data.nom,
                        prenoms=enseignant_data.prenoms,
                        role_id=role_id, # Role ID pour étudiant
                        reset_token=token,
                        token_expires=token_expires
                    )
                    print(f"Utilisateur {enseignant_data.username} enregistré avec succès. ID Utilisateur: {utilisateur_id}")

                    # Créer l'enseignant avec l'ID de l'utilisateur
                    enseignant_creation_data = {
                        'matricule': matricule,
                        'slug': matricule,
                        'grade_id': enseignant_data.grade_id,
                        'departement_id': enseignant_data.departement_id,
                        'utilisateur_id': utilisateur_id
                    }
                    await self.repository.create_enseignant(enseignant_creation_data)
                    print(f"Enseignant créé avec succès pour l'utilisateur {enseignant_data.username}.")

                # Si tout s'est bien passé, committer la transaction
                await session.commit()
            
                # Envoyer l'e-mail de bienvenue après la création réussie de l'étudiant
                app_name = "SoutenanceManager"
                subject = "Invitation à SoutenanceManager"
                subject_with_app = f"[{app_name}] {subject}"
                reset_url = f"http://localhost:3000/password?token={token}"  
                logo_url = "http://localhost:3000"
                body = f"""
                    <html>
                        <head>
                            <title>Invitation</title>
                            <style>
                                body {{
                                    font-family: Arial, sans-serif;
                                    background-color: #f5f5f5;
                                }}
                                .container {{
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    background-color: #fff;
                                    border: 1px solid #ccc;
                                    border-radius: 5px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }}
                                
                                .button-container {{
                                    text-align: center;
                                }} 
                                .button {{
                                    display: inline-block;
                                    background-color: #ebbebe;
                                    color: black;
                                    padding: 10px 20px;
                                    text-decoration: none;
                                    border-radius: 5px;
                                    transition: background-color 0.3s ease;
                                }}
                                
                                .logo-container {{
                                    text-align: center;
                                    margin-bottom: 30px;
                                }}
                                .logo-container img {{
                                    max-width: 100px;
                                }}
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="logo-container">
                                    <a href="{logo_url}">
                                        <img src="cid:logo" alt="Logo">
                                    </a>
                                </div>
                                
                                <h2>Bienvenue dans le Système de Gestion des Soutenances</h2>
                                <p>Bonjour Mr ou Mme {enseignant_data.prenoms} {enseignant_data.nom},</p>
                                <p>Vous avez été ajouté au Système de Gestion des Soutenances.</p>
                                <p>Vous pouvez maintenant vous connecter pour nous aider à préparer la soutenance des étudiants.</p>
                                <p>Pour commencer, veuillez cliquer sur le bouton ci-dessous pour définir votre mot de passe :</p>
                                <div class="button-container">
                                    <a href="{reset_url}" class="button">Définir mot de passe</a>
                                </div>
                                <p>Cordialement,<br>L'équipe administrative de {app_name}</p>
                            </div>
                        </body>
                    </html>
                """
                await send_email(enseignant_data.username, subject_with_app, body, app_name)
                raise EnseignantExceptions().enseignant_create
            
            except Exception as e:
                print(f"Une erreur s'est produite : {str(e)}")
                await session.rollback()
                raise e
            
    async def delete_enseignant(self, enseignant_slug: int):
        data = { 'enseignant_slug': enseignant_slug}
        if not await self.repository.delete_enseignant(**data):
            raise EnseignantExceptions().enseignant_not_found

    async def update_enseignant(self, enseignant_slug: int, updated_data: UpdateEnseignantSchema):
        if updated_data.is_empty:
            raise EnseignantExceptions().empty_data
        return await self.repository.update_enseignant(
             enseignant_slug=enseignant_slug, updated_data=updated_data
        )

    async def get_enseignant(self, utilisateur_id: int):
        data = {'utilisateur_id': utilisateur_id}
        if (result := await self.repository.get_enseignant(**data)) is None:
            raise EnseignantExceptions().enseignant_not_found
        return result

    async def get_enseignants_by_departement(self, departement_id: int, limit: int, offset: int) -> List[EnseignantSchema]:
        return await self.repository.get_enseignants_by_departement(departement_id, limit, offset)
    

    async def get_departements(self) -> List[DepartementSchema]:
        departements = await self.repository.get_departements()
        return [DepartementSchema.from_orm(departement) for departement in departements]
    
    async def get_grades(self) -> List[GradeSchema]:
        grades = await self.repository.get_grades()
        return [DepartementSchema.from_orm(grade) for grade in grades]
    
    async def get_enseignant_by_matricule(self, matricule: int):
        data = {'matricule': matricule}
        if (result := await self.repository.get_enseignant_by_matricule(**data)) is None:
            raise EnseignantExceptions().enseignant_not_found
        return result
    
    async def get_filieres_by_departement(self, departement_id: int):
        try:
            filieres = await self.repository.get_filieres_by_departement(departement_id)
            return [FiliereSchema.from_orm(filiere) for filiere in filieres]
        except Exception as e:
            # Gérer les exceptions appropriées ici
            raise e