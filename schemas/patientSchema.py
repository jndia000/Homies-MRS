from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel

class Patient(BaseModel):
    first_name: str
    middle_name: str
    last_name: str
    sex: str
    birthday: str
    contact_number: str
    house_number: str
    street: str
    barangay: str
    municipality: str
    province: str
    active_status: str
    created_at: datetime
    updated_at: datetime

class AddPatient(BaseModel):
    first_name: str
    middle_name: str
    last_name: str
    sex: str
    birthday: str
    contact_number: str
    street: str
    barangay: str
    municipality: str
    province: str
    region: str
    weight: str
    height: str
    blood_type: str
    guardian: str
    patient_type: str

    class Config():
        orm_mode = True

class UpdatePatient(BaseModel):
    first_name: str
    middle_name: str
    last_name: str
    sex: str
    birthday: str
    contact_number: str
    street: str
    barangay: str
    municipality: str
    province: str
    region: str
    weight: str
    height: str
    blood_type: str
    guardian: str
    patient_type:str

    class Config():
        orm_mode = True

class ShowPatient(BaseModel):
    first_name: str
    middle_name: str
    last_name: str    

    class Config():
        orm_mode = True

class ShowOnePatient(BaseModel):
    patient_id: str

    class Config():
        orm_mode = True


class Discharge(BaseModel):
    reason_of_admittance: str
    diagnosis_at_admittance: str
    date_admitted: str
    treatment_summary: str
    discharge_date: str
    physician_approved: str
    discharge_diagnosis: str
    further_treatment_plan: str
    next_check_up_date: str
    client_consent_approval: str
    medication: str
    dosage: str
    frequency: str
    ending_date: str
    active_status: str
    created_at: datetime
    updated_at: datetime

class AddDischarge(BaseModel):
    patient_id: str
    reason_of_admittance: str
    diagnosis_at_admittance: str
    date_admitted: str
    treatment_summary: str
    discharge_date: str
    physician_approved: str
    discharge_diagnosis: str
    further_treatment_plan: str
    next_check_up_update: str
    client_consent_approval: str
    ending_date: str
    active_status: str

    # class Config():
    #     orm_mode = True

class UpdateDischarge(BaseModel):
    reason_of_admittance: str
    diagnosis_at_admittance: str
    date_admitted: str
    treatment_summary: str
    discharge_date: str
    physician_approved: str
    discharge_diagnosis: str
    further_treatment_plan: str
    next_check_up_date: str
    client_consent_approval: str
    ending_date: str
    active_status: str

    class Config():
        orm_mode = True

class ShowDischarge(BaseModel):
    patient_id: str

    class Config():
        orm_mode = True

class ShowOneDischarge(BaseModel):
    discharge_id: str

    class Config():
        orm_mode = True