from dataclasses import dataclass
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession, AsyncResult
from sqlalchemy import select, insert, delete, update, and_, func
from sqlalchemy.orm import subqueryload, joinedload, selectinload
from database import Base
from users.auth.models import Departement, Etudiant, Filiere, Role, Users
from .schemas import CreateEtudiantSchema, EtudiantSchema, UpdateEtudiantSchema
from .exceptions import EtudiantExceptions
from .interfaces.repositories_interface import EtudiantRepositoriesInterface


@dataclass
class EtudiantRepositories(EtudiantRepositoriesInterface):
    session: AsyncSession
     


    async def get_etudiants(self, limit: int, offset: int):
        # Requête pour obtenir la liste des étudiants avec pagination
        stmt = (
            select(Etudiant)
            .join(Etudiant.utilisateur)  # Join explicite avec la table utilisateur
            .join(Etudiant.filiere)  # Join explicite avec la table filiere
            .options(joinedload(Etudiant.utilisateur))
            .options(joinedload(Etudiant.filiere))
            .filter(Users.is_active == True)  # Filtrer sur l'attribut is_active de l'utilisateur
            .order_by(Etudiant.created.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(stmt)
        etudiants = result.unique().scalars().all()
        etudiant_list = [EtudiantSchema.from_orm(etudiant) for etudiant in etudiants]

        # Requête pour obtenir le nombre total d'étudiants
        total_stmt = (
            select(func.count(Etudiant.id))
            .join(Etudiant.utilisateur)  # Join explicite avec la table utilisateur
            .filter(Users.is_active == True)  # Filtrer sur l'attribut is_active de l'utilisateur
        )
        total_result = await self.session.execute(total_stmt)
        total_users = total_result.scalar()

        return {
            "total_users": total_users,
            "etudiants": etudiant_list
        }
    
    async def create_etudiant(self, etudiant_data: CreateEtudiantSchema):
        values = {
            'matricule': etudiant_data['matricule'],
            'slug': etudiant_data['matricule'],
            'filiere_id': etudiant_data['filiere_id'],
            'utilisateur_id': etudiant_data['utilisateur_id']
        }
        stmt = insert(Etudiant).values(**values).returning(Etudiant)
        result = await self.session.execute(statement=stmt)
        await self.session.commit()
        return {'detail': f'Etudiant avec le matricule {etudiant_data["matricule"]} créé avec succès'}
        
    
    async def delete_etudiant(self, etudiant_slug: int):
        # Récupérer l'étudiant à supprimer
        etudiant = await self.get_etudiant_by_matricule(etudiant_slug)
        if not etudiant:
            raise EtudiantExceptions().etudiant_not_found
    
        # Récupérer l'utilisateur associé à l'étudiant
        utilisateur_id = etudiant.utilisateur_id
        print(utilisateur_id)
        # Mettre à jour le champ is_active de l'utilisateur à False
        stmt = update(Users).where(Users.id == utilisateur_id).values(is_active=False)
        await self.session.execute(stmt)

        # # Supprimer l'étudiant
        # stmt = delete(Etudiant).where(Etudiant.slug == etudiant_slug)
        result = await self.session.execute(statement=stmt)
        await self.session.commit()
        return {'detail': f'Etudiant avec le matricule {etudiant_slug} supprimé avec succès'}
    
    async def update_etudiant(self, etudiant_slug: int, updated_data: UpdateEtudiantSchema):
        await self.__check_etudiant(etudiant_slug=etudiant_slug)
        values = {**updated_data.dict(exclude_none=True)}
        if updated_data.matricule:
            values.update({'slug': updated_data.matricule})
            stmt = update(Etudiant).where(Etudiant.slug == etudiant_slug).values(**values).returning(Etudiant)
            
            result = await self.session.execute(statement=stmt)
        await self.session.commit()
        # return result.scalar_one()
        return {'detail': f'Etudiant avec le matricule {etudiant_slug} mise à jour'}
    
    async def get_etudiant(self, utilisateur_id: int):
        stmt = (
            select(Etudiant)
            .join(Etudiant.utilisateur)
            .options(selectinload(Etudiant.utilisateur))
            .options(selectinload(Etudiant.filiere))  # Ajout du chargement de la filière
            .filter(Users.is_active == True)
            .filter(Etudiant.utilisateur_id == utilisateur_id)
            .order_by(Etudiant.created.desc())
        )
        
        try:
            result = await self.session.execute(stmt)
            etudiant = result.scalars().first()
            
            if etudiant:
                # Accédez explicitement aux attributs pour s'assurer qu'ils sont chargés
                _ = etudiant.utilisateur
                _ = etudiant.filiere
            
            return etudiant
        except Exception as e:
            print(f"Erreur lors de la récupération de l'étudiant: {e}")
            return None
        
    async def get_etudiant_by_matricule(self, matricule: int):
        stmt = (
            select(Etudiant)
            .options(selectinload(Etudiant.filiere)) 
            .where(Etudiant.matricule == matricule)
        )
        
        try:
            result = await self.session.execute(stmt)
            etudiant = result.scalars().first()
            print(etudiant)
            
            if etudiant:
                # Accédez explicitement aux attributs pour s'assurer qu'ils sont chargés
                _ = etudiant.filiere
            
            return etudiant
        except Exception as e:
            print(f"Erreur lors de la récupération de l'étudiant: {e}")
            return None

    async def __check_etudiant(self, etudiant_slug: int):
        if not (etudiant := await self.get_etudiant(etudiant_slug=etudiant_slug)):
            raise EtudiantExceptions().etudiant_not_found
        return etudiant

    async def get_etudiants_by_filiere(self, filiere_id: int, limit: int, offset: int):
        stmt = (
            select(Etudiant)
            .join(Etudiant.utilisateur)
            .join(Etudiant.filiere)  # Ajout d'un join explicite avec filiere
            .options(joinedload(Etudiant.utilisateur))
            .options(joinedload(Etudiant.filiere))  # Chargement eager de la relation filiere
            .filter(Etudiant.filiere_id == filiere_id)
            .filter(Users.is_active == True)
            .order_by(Etudiant.created.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(stmt)
        etudiants = result.unique().scalars().all()
        
        # Utilisez une liste en compréhension avec gestion d'erreur
        etudiant_schemas = []
        for etudiant in etudiants:
            try:
                etudiant_schema = EtudiantSchema.from_orm(etudiant)
                etudiant_schemas.append(etudiant_schema)
            except Exception as e:
                # Log l'erreur ou gérez-la comme vous le souhaitez
                print(f"Erreur lors de la conversion de l'étudiant: {e}")
        
        return etudiant_schemas
        

    async def get_filieres(self, limit: int, offset: int):
        stmt = select(Filiere) \
            .limit(limit) \
            .offset(offset)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_roles(self, limit: int, offset: int):
        stmt = select(Role) \
            .limit(limit) \
            .offset(offset)
        result = await self.session.execute(stmt)
        return result.scalars().all()
    
    async def get_role_by_id(self, id: int):
        stmt = select(Role).filter_by(id=id)
        result = await self.session.execute(stmt)
        role = result.scalar_one_or_none()
        print(role)
        if role:
            return role
        else:
            raise ValueError(f"Rôle avec l'id {id} introuvable")


    async def get_etudiants_by_departement(self, departement_id: int, limit: int, offset: int):
        stmt = (
            select(Etudiant)
            .join(Etudiant.utilisateur)
            .join(Etudiant.filiere)
            .join(Filiere.departement)
            .options(joinedload(Etudiant.utilisateur))
            .options(joinedload(Etudiant.filiere))
            .filter(Departement.id == departement_id)
            .filter(Users.is_active == True)
            .order_by(Etudiant.created.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(stmt)
        etudiants = result.unique().scalars().all()
        
        etudiant_schemas = []
        for etudiant in etudiants:
            try:
                etudiant_schema = EtudiantSchema.from_orm(etudiant)
                etudiant_schemas.append(etudiant_schema)
            except Exception as e:
                print(f"Erreur lors de la conversion de l'étudiant: {e}")
        
        return etudiant_schemas
    