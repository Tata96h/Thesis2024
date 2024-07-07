from abc import ABC, abstractmethod
from datetime import datetime


class UserRepositoriesInterface(ABC):

    @abstractmethod
    async def save_user(self, username: str, password: str, nom: str, prenoms: str, role_id: int, reset_token: str, token_expires: str) -> int:  pass

    @abstractmethod
    async def receive_user_by_username(self, username: str): pass

    @abstractmethod
    async def delete_user(self, utilisateur_id: int): pass

    @abstractmethod
    async def reset_password(self, token: str, new_password: str): pass

    @abstractmethod
    async def get_user_by_token(self, token: str): pass

    @abstractmethod
    async def update_user_password(self, utilisateur_id: int, password: str): pass

    @abstractmethod
    async def clear_reset_token(self, utilisateur_id: int): pass