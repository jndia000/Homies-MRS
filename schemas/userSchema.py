from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
# from sqlalchemy.sql.functions import User


class UserType(BaseModel):
    title: str
    

class ShowUserType(BaseModel):
    title: str
    class Config():
        orm_mode = True


class User(BaseModel):
    user_type_id: str
    email: str
    password: str

class AddUser(BaseModel):
    user_type_id: str
    email: str
    password: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    suffix_name: Optional[str] = None
    birth_date: str
    region: str
    street: str
    barangay: str
    municipality: str
    province: str

class AddUserPatient(BaseModel):
    user_type_id: str
    email: str
    password: str
    patient_id: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    suffix_name: Optional[str] = None
    birth_date: str
    region: str
    street: str
    barangay: str
    municipality: str
    province: str

class AddUserDoctor(BaseModel):
    user_type_id: str
    email: str
    password: str
    doc_id: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    suffix_name: Optional[str] = None
    birth_date: str
    region: str
    street: str
    barangay: str
    municipality: str
    province: str


class AddUserProfile(BaseModel):
    user_id: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    suffix_name: Optional[str] = None
    birth_date: str
    region: str
    street: str
    barangay: str
    municipality: str
    province: str

class updateStatus(BaseModel):
    active_status: str
    
class ShowUser(BaseModel):
    email: str
    user_typesFK: ShowUserType
    active_status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config():
        orm_mode = True

class Login(BaseModel):
    username: str
    password:str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class ShowUsers(BaseModel):
    email: str
    password: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    suffix_name: Optional[str] = None
    birth_date: str
    region: str
    street: str
    barangay: str
    municipality: str
    province: str

class UpdateUserProfile(BaseModel):
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    suffix_name: Optional[str] = None
    birth_date: str
    region: str
    street: str
    barangay: str
    municipality: str
    province: str

class UpdateUser(BaseModel):
    user_type_id: str
    email: str