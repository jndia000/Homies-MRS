from datetime import date, datetime

from pydantic.types import StrictStr
from schemas.doctorSchema import DoctorDetail
from schemas.patientSchema import ShowPatient
from schemas.userSchema import ShowUser
from models.userModel import User
from models.patientModel import PatientRegistration
from models.doctorModel import Doctor
from models.recordModel import Record, History
from typing import List, Optional
from pydantic import BaseModel


class AddMedicine(BaseModel):
    med_product_name: str

    class Config():
        orm_mode = True


class AddSupply(BaseModel):
    ms_product_name: str

    class Config():
        orm_mode = True