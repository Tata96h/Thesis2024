
from datetime import datetime
from sqlalchemy import select, insert, delete, update
from users.auth.exceptions import AuthExceptions
from .interfaces.repositories_interface import UserRepositoriesInterface
from dataclasses import dataclass
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Users


@dataclass
class UserRepositories(UserRepositoriesInterface):
    session: AsyncSession

    async def save_user(self, username: str, password: str, nom: str, prenoms: str, role_id: int, reset_token: str, token_expires: str) -> int:
        stmt = insert(Users).values(
            username=username,
            password=password,
            nom=nom,
            prenoms=prenoms,
            role_id=role_id,
            reset_token=reset_token,
            token_expires=token_expires
        ).returning(Users.id)
        result = await self.session.execute(statement=stmt)
        await self.session.commit()
        utilisateur_id = result.scalar_one()
        return utilisateur_id

    async def receive_user_by_username(self, username: str):
        stmt = select(Users).where(Users.username == username)
        result = await self.session.execute(statement=stmt)
        return result.scalars().first()
    

    async def delete_user(self, utilisateur_id: int):
        stmt = delete(Users).where(Users.id == utilisateur_id)
        await self.session.execute(stmt)
        await self.session.commit()


    async def get_user_by_token(self, token: str):
        stmt = select(Users).where(Users.reset_token == token)
        result = await self.session.execute(stmt)
        user = result.first()
        if user:
            user = user[0]  # Extract the user object from the tuple
        print(f"User from database: {user}")  # For debugging
        return user
        
        
    async def update_user_password(self, utilisateur_id: int, password: str):
        stmt = update(Users).where(Users.id == utilisateur_id).values(password=password)
        await self.session.execute(stmt)
        await self.session.commit()

    async def clear_reset_token(self, utilisateur_id: int):
        stmt = update(Users).where(Users.id == utilisateur_id).values(reset_token=None, token_expires=None)
        await self.session.execute(stmt)
        await self.session.commit()

    async def reset_password(self, token: str, new_password: str):
        user = await self.get_user_by_token(token)
        if not user:
            raise AuthExceptions().invalid_token
        hashed_password = await self.password_service.hashed_password(password=new_password)
        await self.update_user_password(utilisateur_id=user.id, password=hashed_password)
        await self.clear_reset_token(utilisateur_id=user.id)