from dataclasses import dataclass
from fastapi import UploadFile
import aiofiles 
from aiofiles import os as _os

from file_service.interfaces.file_service_interface import FileServiceInterface 

 


def file_not_found(func):
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except FileNotFoundError as err:
            print('file not found', err)

    return wrapper


@dataclass
class FileService(FileServiceInterface):
    path: str

    @file_not_found
    async def write_file(self, fichier: UploadFile, filename: str):
        _filename = f'{self.path}/{filename}'
        async with aiofiles.open(file=_filename, mode='wb') as f:
            raw = await fichier.read()
            await f.write(raw)

    @file_not_found
    async def read_file(self, filename: str):
        _filename = f'{self.path}/{filename}'
        async with aiofiles.open(fichier=_filename, mode='r') as fichier:
            return await fichier.read()

    @file_not_found
    async def delete_fichier(self, filename: str):
        await _os.remove(f'{self.path}/{filename}')
