from abc import ABC, abstractmethod

from fastapi import UploadFile


class FileServiceInterface(ABC):

    @abstractmethod
    async def write_file(self, fichier: UploadFile, filename: str): pass

    @abstractmethod
    async def read_file(self, filename: str): pass

    @abstractmethod
    async def delete_file(self, filename: str): pass
