from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
import database, models, token2
from models import userModel
from schemas import userSchema
from hashing import Hash
from sqlalchemy.orm import Session, joinedload
from jose import jwt
from passlib.context import CryptContext



router = APIRouter(tags=['Authentication'])


# <!-- 
# | =================================================================================
# |                               ADMIN SIDE - LOGIN
# | =================================================================================
# -->
@router.post('/verify')
def login(request: userSchema.Login, db: Session = Depends(database.get_db)):
    user = db.query(userModel.User).options(joinedload(userModel.User.users_profilesFK).joinedload(userModel.UserProfile.docProfileFK), 
                    joinedload(userModel.User.users_profilesFK).joinedload(userModel.UserProfile.patientProfileFK),
                    joinedload(userModel.User.user_typesFK)).filter(userModel.User.email == request.username).first()
    # return user
    if not user:
        return 404
        # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            # detail=f"Invalid Credentials")
    if (user.active_status == "Inactive"):
        return 4040
        
    if not Hash.verify(user.password, request.password):
        return 4041
        # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            # detail=f"Incorrect password")

    access_token = token2.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

# <!-- 
# | =================================================================================
# |                               LOG OUT
# | =================================================================================
# -->
@router.post('/logout')
def logout(response: Response):
    response.delete_cookie('token')
    return {'message': 'Logout Success!'}
