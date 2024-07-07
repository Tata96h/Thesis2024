from dataclasses import dataclass
from sqlalchemy.ext.asyncio import AsyncSession, AsyncResult
from sqlalchemy import select, insert, delete, update,  and_, func
from sqlalchemy.orm import subqueryload, joinedload, selectinload, contains_eager

from users.auth.models import Departement, Enseignant, Etudiant, Filiere, Grade, Users
from .schemas import CreateEnseignantSchema, EnseignantSchema, UpdateEnseignantSchema
from .exceptions import EnseignantExceptions
from .interfaces.repositories_interface import EnseignantRepositoriesInterface


@dataclass
class EnseignantRepositories(EnseignantRepositoriesInterface):
    session: AsyncSession
    
    async def get_enseignants(self, limit: int, offset: int):
        # Requête pour obtenir la liste des étudiants avec pagination
        stmt = (
            select(Enseignant)
            .join(Enseignant.utilisateur)  # Join explicite avec la table utilisateur
            .options(joinedload(Enseignant.utilisateur))
            .options(joinedload(Enseignant.grade))
            .options(joinedload(Enseignant.departement))
            .filter(Users.is_active == True)  # Filtrer sur l'attribut is_active de l'utilisateur
            .order_by(Enseignant.created.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(stmt)
        enseignants = result.unique().scalars().all()
        enseignant_list = [EnseignantSchema.from_orm(enseignant) for enseignant in enseignants]

        # Requête pour obtenir le nombre total d'étudiants
        total_stmt = (
            select(func.count(Enseignant.id))
            .join(Enseignant.utilisateur)  
            .filter(Users.is_active == True)  
        )
        total_result = await self.session.execute(total_stmt)
        total_users = total_result.scalar()

        return {
            "total_users": total_users,
            "enseignants": enseignant_list
        }


    
    async def create_enseignant(self, enseignant_data: CreateEnseignantSchema):
        values = {
            'matricule': enseignant_data['matricule'],
            'slug': enseignant_data['matricule'],
            'grade_id': enseignant_data['grade_id'],
            'departement_id': enseignant_data['departement_id'],
            'utilisateur_id': enseignant_data['utilisateur_id']
        }
        stmt = insert(Enseignant).values(**values).returning(Enseignant)
        result = await self.session.execute(statement=stmt)
        await self.session.commit()
        return {'detail': f'Enseignant avec le matricule {enseignant_data["matricule"]} créé avec succès'}
    
    async def delete_enseignant(self, enseignant_slug: int):
        
        enseignant = await self.get_enseignant(enseignant_slug)
        if not enseignant:
            raise EnseignantExceptions().enseignant_not_found
    
        # Récupérer l'utilisateur associé à l'étudiant
        utilisateur_id = enseignant.utilisateur_id
        print(utilisateur_id)
        # Mettre à jour le champ is_active de l'utilisateur à False
        stmt = update(Users).where(Users.id == utilisateur_id).values(is_active=False)
        await self.session.execute(stmt)

        # Supprimer l'étudiant
        # stmt = delete(Enseignant).where(Enseignant.slug == enseignant_slug)
        result = await self.session.execute(statement=stmt)
        await self.session.commit()
        # return result.rowcount
        return {'detail': f'Enseignant avec le matricule {enseignant_slug} supprimé avec succès'}

    async def update_enseignant(self, enseignant_slug: int, updated_data: UpdateEnseignantSchema):
        await self.__check_enseignant(enseignant_slug=enseignant_slug)
        values = {**updated_data.dict(exclude_none=True)}
        if updated_data.matricule:
            values.update({'slug': updated_data.matricule})
            stmt = update(Enseignant).where(Enseignant.slug == enseignant_slug).values(**values).returning(Enseignant)
            result = await self.session.execute(statement=stmt)
        await self.session.commit()
        return {'detail': f'Enseignant avec le matricule {enseignant_slug} mise à jour'}
    
    async def get_enseignant(self, utilisateur_id: int):
        stmt = (
            select(Enseignant)
            .join(Enseignant.utilisateur)
            .options(selectinload(Enseignant.utilisateur))
            .options(selectinload(Enseignant.grade))
            .options(selectinload(Enseignant.departement)) 
            .filter(Users.is_active == True)
            .filter(Enseignant.utilisateur_id == utilisateur_id)
            .order_by(Enseignant.created.desc())
        )
        
        try:
            result = await self.session.execute(stmt)
            etudiant = result.scalars().first()
            
            if etudiant:
                # Accédez explicitement aux attributs pour s'assurer qu'ils sont chargés
                _ = etudiant.utilisateur
                _ = etudiant.grade
                _ = etudiant.departement
            
            return etudiant
        except Exception as e:
            print(f"Erreur lors de la récupération de l'étudiant: {e}")
            return None

    async def get_enseignant_by_matricule(self, matricule: int):
        stmt = (
            select(Enseignant)
            .options(selectinload(Enseignant.departement))  # Ajout du chargement de la filière
            .options(selectinload(Enseignant.grade))
            .filter(Enseignant.matricule == matricule)
        )
        
        try:
            result = await self.session.execute(stmt)
            enseignant = result.scalars().first()
            
            if enseignant:
                # Accédez explicitement aux attributs pour s'assurer qu'ils sont chargés
                _ = enseignant.departement
                _ = enseignant.grade
            
            return enseignant
        except Exception as e:
            print(f"Erreur lors de la récupération de l'étudiant: {e}")
            return None

    async def __check_enseignant(self, enseignant_slug: int):
        if not (enseignant := await self.get_enseignant(enseignant_slug=enseignant_slug)):
            raise EnseignantExceptions().enseignant_not_found
        return enseignant

    async def get_enseignants_by_departement(self, departement_id: int, limit: int, offset: int):
        try:
            stmt = (
                select(Enseignant)
                .join(Enseignant.utilisateur)
                .join(Enseignant.departement)
                .join(Enseignant.grade)  # Ajout d'un join explicite avec grade
                .options(contains_eager(Enseignant.utilisateur))
                .options(contains_eager(Enseignant.departement))
                .options(contains_eager(Enseignant.grade))  # Utilisation de contains_eager pour grade
                .filter(Enseignant.departement_id == departement_id)
                .filter(Users.is_active == True)
                .order_by(Enseignant.created.desc())
                .limit(limit)
                .offset(offset)
            )
            result = await self.session.execute(stmt)
            enseignants = result.unique().scalars().all()
            
            return [EnseignantSchema.from_orm(enseignant) for enseignant in enseignants]
        except Exception as e:
            print(f"Erreur lors de la récupération des enseignants: {e}")
            return []
        
        
    async def get_departements(self):
        result = await self.session.execute(select(Departement))
        return result.scalars().all()
    
    async def get_grades(self):
        result = await self.session.execute(select(Grade))
        return result.scalars().all()
    
    async def get_filieres_by_departement(self, departement_id: int):
        stmt = select(Filiere).filter(Filiere.departement_id == departement_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()