from re import U
from typing import List
from fastapi import APIRouter,Depends,status,HTTPException
from models import userModel
from schemas import userSchema
from hashing import Hash
import database, oauth2
from sqlalchemy.orm import Session, joinedload

router = APIRouter(
    prefix="/user",
    tags=['Users']
)

get_db = database.get_db

# <!-- 
# | =================================================================================
# |                               GET ALL USER
# | =================================================================================
# -->
@router.get('/alluser')
def get_all_userTyp(db: Session = Depends(get_db)):
    user_type = db.query(userModel.User).options(joinedload(userModel.User.user_typesFK)).options(joinedload(userModel.User.users_profilesFK)).all()
    return user_type

# <!-- 
# | =================================================================================
# |                               GET ALL USER TYPE
# | =================================================================================
# -->
@router.get('/alluserType')
def get_all_userType(db: Session = Depends(get_db)):
    user_type = db.query(userModel.UserType).all()
    return user_type
    
# <!-- 
# | =================================================================================
# |                               ADD USER TYPE
# | =================================================================================
# -->
@router.post('/userType', status_code=status.HTTP_201_CREATED)
def create_user_type(request: userSchema.UserType,db: Session = Depends(get_db)):
    new_user_type = userModel.UserType(title = request.title)
    db.add(new_user_type)
    db.commit()
    return {'message': 'User type created successfully.'}

# <!-- 
# | =================================================================================
# |                               ADD USER
# | =================================================================================
# -->
@router.post('/newUser', status_code=status.HTTP_201_CREATED)
def create_new_user(request: userSchema.AddUser,db: Session = Depends(get_db)):
    new_user = userModel.User(user_type_id  = request.user_type_id, 
                                email       = request.email,
                                password    = Hash.bcrypt(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_profile = userModel.UserProfile(user_id        =   new_user.user_id, 
                                        first_name      =   request.first_name,
                                        middle_name     =   request.middle_name,
                                        last_name       =   request.last_name,
                                        suffix_name     =   request.suffix_name,
                                        birth_date      =   request.birth_date,
                                        region          =   request.region,
                                        street          =   request.street,
                                        barangay        =   request.barangay,
                                        municipality    =   request.municipality,
                                        province        =   request.province)
    db.add(user_profile)
    db.commit()
    db.refresh(user_profile)
    return user_profile

# <!-- 
# | =================================================================================
# |                               ADD USER = PATIENT
# | =================================================================================
# -->
@router.post('/newPatientAccount', status_code=status.HTTP_201_CREATED)
def create_new_patient_account(request: userSchema.AddUserPatient,db: Session = Depends(get_db)):
    new_user = userModel.User(user_type_id  = request.user_type_id, 
                                email       = request.email,
                                password    = Hash.bcrypt(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_profile = userModel.UserProfile(user_id        =   new_user.user_id, 
                                        patient_id      =   request.patient_id,
                                        first_name      =   request.first_name,
                                        middle_name     =   request.middle_name,
                                        last_name       =   request.last_name,
                                        suffix_name     =   request.suffix_name,
                                        birth_date      =   request.birth_date,
                                        region          =   request.region,
                                        street          =   request.street,
                                        barangay        =   request.barangay,
                                        municipality    =   request.municipality,
                                        province        =   request.province)
    db.add(user_profile)
    db.commit()
    db.refresh(user_profile)
    return user_profile

# <!-- 
# | =================================================================================
# |                               ADD USER = DOCTOR
# | =================================================================================
# -->
@router.post('/newDoctorAccount', status_code=status.HTTP_201_CREATED)
def create_new_doctor_account(request: userSchema.AddUserDoctor,db: Session = Depends(get_db)):
    new_user = userModel.User(user_type_id  = request.user_type_id, 
                                email       = request.email,
                                password    = Hash.bcrypt(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_profile = userModel.UserProfile(user_id        =   new_user.user_id, 
                                        doc_id          =   request.doc_id,
                                        first_name      =   request.first_name,
                                        middle_name     =   request.middle_name,
                                        last_name       =   request.last_name,
                                        suffix_name     =   request.suffix_name,
                                        birth_date      =   request.birth_date,
                                        region          =   request.region,
                                        street          =   request.street,
                                        barangay        =   request.barangay,
                                        municipality    =   request.municipality,
                                        province        =   request.province)
    db.add(user_profile)
    db.commit()
    db.refresh(user_profile)
    return user_profile

# <!-- 
# | =================================================================================
# |                               UPDATE USER STATUS
# | =================================================================================
# -->
@router.put('/updateUserStatus/{user_id}', status_code=status.HTTP_202_ACCEPTED)
def updateStatus(user_id: str, request: userSchema.updateStatus,db: Session = Depends(get_db)):
    if not db.query(userModel.User).filter(userModel.User.user_id == user_id).update({
                                                    'active_status': request.active_status
                                                    }):
        raise HTTPException(404, 'User not found')
    db.commit()
    updated_user = db.query(userModel.User).filter(userModel.User.user_id == user_id).first()
    return updated_user

# <!-- 
# | =================================================================================
# |                               ADD  USER PROFILE
# | =================================================================================
# -->
@router.post('/userProfile', status_code=status.HTTP_201_CREATED)
def create_user_profile(request: userSchema.AddUserProfile,db: Session = Depends(get_db)):
    user_profile = userModel.UserProfile(user_id        =   request.user_id, 
                                        first_name      =   request.first_name,
                                        middle_name     =   request.middle_name,
                                        last_name       =   request.last_name,
                                        suffix_name     =   request.suffix_name,
                                        birth_date      =   request.birth_date,
                                        region          =   request.region,
                                        street          =   request.street,
                                        barangay        =   request.barangay,
                                        municipality    =   request.municipality,
                                        province        =   request.province)
    db.add(user_profile)
    db.commit()
    db.refresh(user_profile)
    return {'message': 'User profile created successfully.'}

# <!-- 
# | =================================================================================
# |                               GET ONE USER
# | =================================================================================
# -->
@router.get('/{user_id}', response_model=userSchema.ShowUser)
def get_user(user_id:str,db: Session = Depends(get_db)):
    user = db.query(userModel.User).filter(userModel.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {user_id} is not available")
    return user

# <!-- 
# | =================================================================================
# |                               GET ALL USER
# | =================================================================================
# -->
@router.get('/')
def get_all(db: Session = Depends(get_db)):
    users = db.query(userModel.User).options(joinedload(userModel.User.user_typesFK),
                                            joinedload(userModel.User.users_profilesFK)).all()
    return users

# <!-- 
# | =================================================================================
# |                               GET ONE USER
# | =================================================================================
# -->
@router.get('/ShowUsers/{user_id}')
def show_user(user_id:str,db: Session = Depends(get_db)):
    show_user = db.query(userModel.User).options(joinedload(userModel.User.users_profilesFK),joinedload(userModel.User.user_typesFK)).filter(userModel.User.user_id ==  user_id).first()

    return show_user

# <!-- 
# | =================================================================================
# |                               GET ALL PATIENT RECORD
# | =================================================================================
# -->
@router.put('/User/UpdateUser/{user_id}', status_code=status.HTTP_202_ACCEPTED)
def update_user_(user_id: str, request: userSchema.UpdateUser,db: Session = Depends(get_db)):
    if not db.query(userModel.User).filter(userModel.User.user_id == user_id).update({
                                                    'user_type_id': request.user_type_id,
                                                    'email': request.email,
                                                    }):
        raise HTTPException(404, 'User Profile not found')
    db.commit()
    updated_user = db.query(userModel.User).filter(userModel.User.user_id == user_id).first()
    return updated_user

# <!-- 
# | =================================================================================
# |                               UPDATE USER PROFILE
# | =================================================================================
# -->
@router.put('/UpdateUserProfile/{user_profile_id}', status_code=status.HTTP_202_ACCEPTED)
def update_user_profile(user_profile_id: str, request: userSchema.UpdateUserProfile,db: Session = Depends(get_db)):
    if not db.query(userModel.UserProfile).filter(userModel.UserProfile.user_profile_id == user_profile_id).update({
                                                    'first_name': request.first_name,
                                                    'middle_name': request.middle_name,
                                                    'last_name': request.last_name,
                                                    'suffix_name': request.suffix_name,
                                                    'birth_date': request.birth_date,
                                                    'region': request.region,
                                                    'street': request.street,
                                                    'barangay': request.barangay,
                                                    'municipality': request.municipality,
                                                    'province': request.province
                                                    }):
        raise HTTPException(404, 'User Profile not found')
    db.commit()
    updated_user_profile = db.query(userModel.UserProfile).filter(userModel.UserProfile.user_profile_id == user_profile_id).first()
    return updated_user_profile



