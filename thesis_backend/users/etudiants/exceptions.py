from fastapi import HTTPException, status


class EtudiantExceptions:
    @property
    def etudiant_not_found(self):
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Etudiants non trouvé'
        )
    @property
    def etudiant_exists(self):
        return HTTPException (
        status_code=status.HTTP_400_BAD_REQUEST,
        detail='Cet etudiant existe déjà'
    )

    @property
    def empty_data(self):
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail='Empty dict')
    
    @property
    def etudiant_create(self):
        return HTTPException (
        status_code=status.HTTP_201_CREATED,
        detail='Etudiant créé avec succès'
    )
    