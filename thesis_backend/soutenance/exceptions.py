from fastapi import HTTPException, status


class ThesisExceptions:
    @property
    def thesis_not_found(self):
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Thesis not found'
        )

    @property
    def thesis_create(self):
        return HTTPException (
        status_code=status.HTTP_201_CREATED,
        detail='Thesis créé avec succès'
    )
    

    @property
    def empty_data(self):
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail='Empty dict')
