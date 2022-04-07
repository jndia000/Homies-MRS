from datetime import date, datetime

from pydantic.types import StrictStr
from schemas.doctorSchema import DoctorDetail
from schemas.patientSchema import ShowPatient
from schemas.userSchema import ShowUser
from models.userModel import User
from models.patientModel import PatientRegistration
from models.doctorModel import Doctor
from models.doctorModel import Doctor
from typing import List, Optional
from pydantic import BaseModel



class RequestFormSchema(BaseModel):
    patient_first_name: str
    patient_last_name: str
    patient_record_id: str
    patient_email: str
    patient_phone: str
    patient_birth_date: str
    patient_gender: str
    requester_first_name: str
    requester_last_name: str
    requester_relationship: str
    requester_birth_date: str
    requester_gender: str
    requester_email: str
    requester_phone: str
    house_number:str
    street:str
    barangay: str
    municipality: str
    province: str
    request_information: str
    disclosure_reason: str
    delivery: str

class ApproveSchema(BaseModel):
    patient_id: str
    delivery: str
    email: str

class rejectSchema(BaseModel):
    active_status: str
    review_reason: Optional[str] = None


class patientRequest(BaseModel):
    patient_id: str
    request_information: str
    disclosure_reason: str
    delivery: str
    email: Optional[str] = None
    
class ViewpatientRequest(BaseModel):
    patient_id: str
    request_information: str
    disclosure_reason: str
    delivery: str
    email: Optional[str] = None