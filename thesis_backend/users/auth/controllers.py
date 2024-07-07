from typing import Annotated, Union
from urllib import response
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm

# from users.auth.exceptions import AuthExceptions
from .schemas import CreateLoginSchema, CreateUserSchema, BaseUserAccountSchema, ResetPasswordSchema
from .presenter import UserPresenter, TokenPresenter
from .deps import get_option_presenter, response_data, get_token_service_data
from sqlalchemy.ext.asyncio import  AsyncSession

auth_controllers = APIRouter(prefix='/auth', tags=['users'])


@auth_controllers.post(**response_data.get('signup'))
async def sign_up(
        users_data: CreateUserSchema,
        option_presenter=Depends(get_option_presenter),
):
    return await UserPresenter(**option_presenter) \
        .sign_up(**users_data.dict())



@auth_controllers.post(**response_data.get('login'))
async def login(
        form_data: CreateLoginSchema,
        # form_data: OAuth2PasswordRequestForm = Depends(),
        option_presenter=Depends(get_option_presenter),
):
    #breakpoint()
    return await UserPresenter(**option_presenter) \
        .login(username=form_data.username, password=form_data.password)


       

@auth_controllers.post(**response_data.get('create_token'))
async def get_token(
        username: BaseUserAccountSchema,
        token_data=Depends(get_token_service_data)
):
    return await TokenPresenter(**token_data) \
        .get_token(username=username.username)

@auth_controllers.delete(**response_data.get('delete_user'))
async def delete_user(
        utilisateur_id : int,
        option_presenter=Depends(get_option_presenter)
      
):
    return await UserPresenter(**option_presenter) \
        .delete_user(utilisateur_id=utilisateur_id)


@auth_controllers.post("/reset-password", response_model=dict)
async def reset_password(
    reset_data: ResetPasswordSchema,
    option_presenter=Depends(get_option_presenter)
):
    try:
        await UserPresenter(**option_presenter).reset_password(
            token=reset_data.token, new_password=reset_data.new_password)
        return {"detail": "Mot de passe réinitialiser avec succès"}
    except HTTPException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
