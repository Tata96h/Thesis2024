from dataclasses import dataclass
from datetime import datetime, timedelta
import secrets
from sqlalchemy import select
from typing import List
import string, random
from database import AsyncSessionLocal
from soutenance.schemas import AnneeSchema
from users.auth.models import Role
from users.auth.service_email import send_email
from users.auth.exceptions import AuthExceptions
from users.auth.interfaces.password_service_interface import PasswordServiceInterface
from users.auth.interfaces.repositories_interface import UserRepositoriesInterface
from .schemas import EtudiantSchema, FiliereSchema, RoleSchema, UpdateEtudiantSchema, CreateEtudiantSchema
from .interfaces.repositories_interface import EtudiantRepositoriesInterface
from .exceptions import EtudiantExceptions
from sqlalchemy.exc import SQLAlchemyError


@dataclass
class EtudiantPresenter:
    repository: EtudiantRepositoriesInterface
    user_repository: UserRepositoriesInterface
    password_service: PasswordServiceInterface  


    async def get_etudiants(self,  limit: int, offset: int):
        data = { 'limit': limit, 'offset': offset}
        return await self.repository.get_etudiants(**data)

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

    async def create_etudiant(self, etudiant_data: CreateEtudiantSchema):
        async with AsyncSessionLocal() as session:
            utilisateur_id = None  # Initialiser utilisateur_id à None
            try:
                async with session.begin_nested():
                    # Vérifier si l'utilisateur existe déjà
                    if await self.user_repository.receive_user_by_username(username=etudiant_data.username):
                        raise AuthExceptions().username_exists
                    
                    # Générer un matricule unique
                    matricule = await self.generate_unique_matricule()
                    while await self.repository.get_etudiant_by_matricule(matricule):
                        print(f"Le matricule {matricule} existe déjà. Génération d'un nouveau matricule...")
                        matricule = await self.generate_unique_matricule()
                    print(f"Matricule unique généré: {matricule}")


                    role_id = await self.get_role_id_by_libelle(libelle='Etudiant')
                
                    
                    # Générer un token de réinitialisation
                    token = secrets.token_urlsafe(32)
                    token_expires = datetime.utcnow() + timedelta(hours=24)
                    password= None
                    # Hacher le mot de passe
                    # hashed_password = await self.password_service.hashed_password(password=etudiant_data.password)

                    # Enregistrer l'utilisateur et récupérer l'utilisateur_id
                    utilisateur_id = await self.user_repository.save_user(
                        username=etudiant_data.username,
                        password=password,
                        nom=etudiant_data.nom,
                        prenoms=etudiant_data.prenoms,
                        role_id=role_id,  # Role ID pour étudiant
                        reset_token=token,
                        token_expires=token_expires
                    )
                    print(f"Utilisateur {etudiant_data.username} enregistré avec succès. ID Utilisateur: {utilisateur_id}")

                    # Créer l'etudiant avec l'ID de l'utilisateur
                    etudiant_creation_data = {
                        'matricule': matricule,
                        'slug': matricule,
                        'filiere_id': etudiant_data.filiere_id,
                        'utilisateur_id': utilisateur_id
                    }
                    await self.repository.create_etudiant(etudiant_creation_data)
                    print(f"Etudiant créé avec succès pour l'utilisateur {etudiant_data.username}.")

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
                                    background-color: #ebd8d8;
                                }}
                                .container {{
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    background-color: #ebbeb;
                                    border: 1px solid #ccc;
                                    border-radius: 5px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }}
                                
                                .button-container {{
                                    text-align: center;
                                }} 
                                .button {{
                                    display: inline-block;
                                    background-color: blue;
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
                                <p>Bonjour {etudiant_data.prenoms},</p>
                                <p>Vous avez été ajouté au Système de Gestion des Soutenances.</p>
                                <p>Vous pouvez maintenant vous connecter pour préparer votre soutenance.</p>
                                <p>Pour commencer, veuillez cliquer sur le bouton ci-dessous pour définir votre mot de passe :</p>
                                <div class="button-container">
                                    <a href="{reset_url}" class="button">Définir mot de passe</a>
                                </div>
                                <p>Cordialement,<br>L'équipe administrative de {app_name}</p>
                            </div>
                        </body>
                    </html>
                """
                await send_email(etudiant_data.username, subject_with_app, body, app_name)
                raise EtudiantExceptions().etudiant_create
            
            except Exception as e:
                print(f"Une erreur s'est produite : {str(e)}")
                await session.rollback()
                raise e
            
            

    async def delete_etudiant(self, etudiant_slug: int):
        data = { 'etudiant_slug': etudiant_slug}
        if not await self.repository.delete_etudiant(**data):
            raise EtudiantExceptions().etudiant_not_found

    async def update_etudiant(self, etudiant_slug: int, updated_data: UpdateEtudiantSchema):
        if updated_data.is_empty:
            raise EtudiantExceptions().empty_data
        return await self.repository.update_etudiant(
             etudiant_slug=etudiant_slug, updated_data=updated_data
        )

    async def get_etudiant(self, utilisateur_id: int):
        data = {'utilisateur_id': utilisateur_id}
        if (result := await self.repository.get_etudiant(**data)) is None:
            raise EtudiantExceptions().etudiant_not_found
        return result
    
    async def get_etudiant_by_matricule(self, matricule: int):
        data = {'matricule': matricule}
        if (result := await self.repository.get_etudiant_by_matricule(**data)) is None:
            raise EtudiantExceptions().etudiant_not_found
        return result

    async def get_etudiants_by_filiere(self, filiere_id: int, limit: int, offset: int) -> List[EtudiantSchema]:
        return await self.repository.get_etudiants_by_filiere(filiere_id, limit, offset)
    
    async def get_etudiants_by_departement(self, departement_id: int, limit: int, offset: int) -> List[EtudiantSchema]:
        return await self.repository.get_etudiants_by_departement(departement_id, limit, offset)
    
    async def get_filieres(self, limit: int, offset: int) -> List[FiliereSchema]:
        filieres = await self.repository.get_filieres(limit, offset)
        return [FiliereSchema.from_orm(filiere) for filiere in filieres]
    
    async def get_roles(self, limit: int, offset: int) -> List[RoleSchema]:
        roles = await self.repository.get_roles(limit, offset)
        return [RoleSchema.from_orm(role) for role in roles]
    
    async def get_role_by_id(self, id: int) -> List[RoleSchema]:
        data = {'id': id}
        result = await self.repository.get_role_by_id(**data)
        if result is None:
            raise EtudiantExceptions().etudiant_not_found
        print(result)
        
        role_schema = RoleSchema.from_orm(result)
        
        return [role_schema]

    
        
    