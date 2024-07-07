from fastapi import HTTPException, status # type: ignore


class AuthExceptions:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_expired = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Token expiré'
    )
    invalid_token = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Token invalide'
    )

    incorrect_username_or_password = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail='Mot de passe ou username incorrect'
    )

    username_exists = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail='Ce username existe déjà'
    )

    UNAUTHORIZED= HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Accès non autorisé'
    )
    user_not_found= HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail='Utilisateur non trouvé'
    )
    user_create= HTTPException(
        status_code=status.HTTP_201_CREATED,
        detail='Utilisateur créé avec succès'
    )