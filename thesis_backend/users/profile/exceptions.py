from fastapi import HTTPException, status


class ProfileExceptions:
    username_exists = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail='Utilisateur avec ce username existe'
    )
    image_created = HTTPException(
        status_code=status.HTTP_201_CREATED,
        detail='Image enrégistré avec succès'
    )
    image_delete = HTTPException(
        status_code=status.HTTP_201_CREATED,
        detail='Image supprimé avec succès'
    )