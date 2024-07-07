from fastapi import HTTPException, status


class JuryExceptions:
    @property
    def jury_not_found(self):
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Jury non trouvé'
        )
    @property
    def jury_exists(self):
        return HTTPException (
        status_code=status.HTTP_400_BAD_REQUEST,
        detail='Ce jury existe déjà'
    )

    @property
    def empty_data(self):
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail='Empty dict')
    
    @property
    def jury_create(self):
        return HTTPException (
        status_code=status.HTTP_201_CREATED,
        detail='Jury créé avec succès'
    )
    