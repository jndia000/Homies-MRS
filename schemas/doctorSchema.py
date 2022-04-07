from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel

class Doctor(BaseModel):
    first_name: str
    middle_name: str
    last_name: str
    department: str
    contact_number: str
    region: str
    street: str
    barangay: str
    municipality: str
    province: str
    active_status: str
    created_at: datetime
    updated_at: datetime


class DoctorDetail(BaseModel):
    first_name: str
    middle_name: str
    last_name: str
    department: str
    
    class Config():
        orm_mode = True

class AddDoctor(BaseModel):
    first_name: str
    middle_name: str
    last_name: str
    department: str
    birth_date: str
    contact_number: str
    region: str
    street: str
    barangay: str
    municipality: str
    province: str
    
    class Config():
        orm_mode = True

