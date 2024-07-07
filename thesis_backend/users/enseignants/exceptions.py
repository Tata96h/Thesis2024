from fastapi import HTTPException, status


class EnseignantExceptions:
    @property
    def enseignant_not_found(self):
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Enseignant non trouvé'
        )
    @property
    def enseignant_exists(self):
        return HTTPException (
        status_code=status.HTTP_400_BAD_REQUEST,
        detail='Cet enseignant existe déjà'
    )

    @property
    def empty_data(self):
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail='Empty dict')
    
    @property
    def enseignant_create(self):
        return HTTPException (
        status_code=status.HTTP_201_CREATED,
        detail='Enseignant créé avec succès'
    )
    