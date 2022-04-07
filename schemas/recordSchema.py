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

class Record(BaseModel):
    patient_id: str
    created_by: str
    created_at: datetime
    updated_at: datetime


class ShowRecord(BaseModel):
    patient_id: str
    created_by: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config():
        orm_mode = True

class AddRecord(BaseModel):
    patient_id: str


class patientRecord(BaseModel):
    patient_record_id: str
    patient_id: str

class AddLog(BaseModel):
    patient_record_id: str

class AddLogDetail(BaseModel):
    patient_call_log_id: str
    call_log_date: date
    # payor_called: str
    contact_first_name: str
    contact_last_name: str
    contact_phone: str
    call_details: str
    follow_up_date: Optional[str] = None


class AddMedication(BaseModel):
    patient_record_id: str
    drug_name: str
    dosage: str
    route: str
    frequency: str
    quantity: str
    refill: str
    instructions: str
    start_date: str
    end_date: str
    medication_status: str


class AddAllergy(BaseModel):
    patient_record_id: str
    allergen: str
    reaction: str
    severity: str
    comment: str


class AddImmunization(BaseModel):
    patient_record_id: str
    vaccine: str
    type: str
    date_given: str
    administered_by: str


class UpdateAttachment(BaseModel):
    type: str


class AddHistory(BaseModel):
    patient_id: str
    chief_complaint: str
    previous_hospital: str
    previous_doctor: str
    previous_diagnosis: str
    previous_treatment: str
    previous_surgeries: str
    previous_medication: str
    health_conditions: str
    special_privileges: str
    family_history: str

class AddProblem(BaseModel):
    patient_record_id: str
    active_status: str
    problem_name: str
    problem_note: str
    date_occured: date
    date_resolved: Optional[str] = None

class AddDiagnosis(BaseModel):
    patient_record_id: str
    doc_id: str
    diagnosis: str
    description: str
    
# class AddDiagnosisDetail(BaseModel):
#     diagnosis_id: str
#     diagnosis: str
#     description: str

class AddLabResult(BaseModel):
    patient_record_id: str
    specimen: str
    result: str
    reference: str
    unit: str
    status: str
    detailed_result: str

class AddSurgeryType(BaseModel):
    name: str
    description: str

class AddSurgery(BaseModel):
    patient_record_id: str
    surgery_type_id: str
    start_time: str
    end_time: str
    description: str

class AddPrescription(BaseModel):
    patient_record_id: str
    med_id: str
    medication_type: str
    dosage: str
    quantity: str
    frequency: str
    route: str
    doc_id: str
    prescription_notes: str
    date_prescribed: Optional[str] = None

class AddPrescriptionSupply(BaseModel):
    patient_record_id: str
    supply_id: str
    medication_type: str
    quantity: str
    doc_id: str
    prescription_notes: str
    date_prescribed: Optional[str] = None


# class AddPrescriptionDetail(BaseModel):
#     prescription_id: str
#     medication_name: str
#     dosage: str
#     quantity: str
#     frequency: str
#     med_taken_for: str

class AddProgressNote(BaseModel):
    patient_record_id: str
    doc_id: str
    reason_for_consultation: str
    physical_examination: str
    impression: str
    recommendation: str
    consultation_date: Optional[str] = None
    next_appointment: Optional[str] = None

# class AddProgressNoteDetail(BaseModel):
   


class History(BaseModel):
    chief_complaint: str
    medical_history: str
    allergy: str
    general_physician: str
    medication: str
    family_history: str

class ShowHistory(BaseModel):
    chief_complaint: str
    medical_history: str
    allergy: str
    general_physician: str
    medication: str
    family_history: str

    class Config():
        orm_mode = True

class ShowProblem(BaseModel):
    problem_name: StrictStr

class ShowDiagnosisDetail(BaseModel):
    diagnosis_id: StrictStr
    description: StrictStr

class ShowDiagnosis(BaseModel):
    doc_id: DoctorDetail
    diagnosis_detail : ShowDiagnosisDetail
    
class ShowDiagnosticResult(BaseModel):
    doc_id: str
    diagnosis: str
    description: str
    
    class Config():
        orm_mode = True

class ShowLabResult(BaseModel):
    specimen: StrictStr
    result: StrictStr
    reference: StrictStr
    unit: StrictStr
    status: StrictStr
    detailed_result: StrictStr

class ShowPrescriptionDetail(BaseModel):
    medication_name: StrictStr
    dosage: StrictStr
    quantity: StrictStr
    frequency: StrictStr
    med_taken_for: StrictStr

class ShowPrescriptionDrug(BaseModel):
    medication_name: str
    dosage: str
    quantity: str
    frequency: str
    med_taken_for: str
    doc_id: str
    prescription_notes: str

class ShowPrescription(BaseModel):
    doc_id: DoctorDetail
    prescription_detail: ShowPrescriptionDetail

class ShowPrescriptionSupply(BaseModel):
    medication_name: str
    quantity: str
    doc_id: str
    prescription_notes: str

class ShowProgressNote(BaseModel):
    reason_for_consultation: StrictStr
    physical_examination: StrictStr
    impression: StrictStr
    recommendation: StrictStr
    next_appointment: StrictStr

class ShowLabResult(BaseModel):
    specimen: StrictStr
    result: StrictStr
    reference: StrictStr
    unit: StrictStr
    status: StrictStr
    detailed_result: StrictStr

class ShowCallLog(BaseModel):
    call_log_date: StrictStr
    contact_first_name: StrictStr
    contact_last_name: StrictStr
    contact_phone: StrictStr
    call_details: StrictStr
    follow_up_date: StrictStr

class ShowMedicalRecord(BaseModel):
    patient_recordFK: ShowPatient
    created_by: ShowUser
    historyrecordFK: ShowHistory
    problemrecordFK: List[ShowProblem] =[]
    diagnosisrecordFK: ShowDiagnosis
    labresultFK: ShowLabResult
    prescriptionrecordFK: ShowPrescription
    progressnoterecordFK: ShowProgressNote

    
    class Config():
        orm_mode = True
        
class ViewDiagnosticResult(BaseModel):
    doc_id: str
    diagnosis: str
    description: str
    
    class Config():
        orm_mode = True
        
class UpdateMedicalHistory(BaseModel):
    chief_complaint: str
    medical_history: str
    allergy: str
    general_physician: str
    medication: str
    family_history: str
    
    class Config():
        orm_mode = True

class UpdateProblem(BaseModel):
    date_resolved: date

class UpdateMedicalProblem(BaseModel):
    problem_name: str
    problem_note: str
    active_status: str
    date_occured: str
    date_resolved: Optional[date] = None

    class Config():
        orm_mode = True

class UpdateProgressNote(BaseModel):
    reason_for_consultation: str
    physical_examination: str
    impression: str
    recommendation: str
    next_appointment: str
    consultation_date: str

    class Config():
        orm_mode = True

class UpdateLabResult(BaseModel):
    specimen: str
    result: str
    reference: str
    unit: str
    status: str
    detailed_result: str

    class Config():
        orm_mode = True

class UpdateCallLog(BaseModel):
    call_log_date: str
    contact_first_name: str
    contact_last_name: str
    contact_phone: str
    call_details: str
    follow_up_date: str
    
    class Config():
        orm_mode = True

class UpdatePrescriptionDrug(BaseModel):
    med_id: str
    dosage: str
    quantity: str
    frequency: str
    route: str
    doc_id: str
    prescription_notes: str
    date_prescribed: str

    class Config():
        orm_mode = True
    
class updateDiagnosis(BaseModel):
    doc_id: str
    diagnosis: str
    description: str
    
    class Config():
        orm_mode = True

class UpdatePrescriptionSupply(BaseModel):
    supply_id: str
    quantity: str
    doc_id: str
    prescription_notes: str
    date_prescribed: str

    class Config():
        orm_mode = True
    
class ViewPrescriptionDrug(BaseModel):
    medication_name: str
    dosage: str
    quantity: str
    frequency: str
    med_taken_for: str
    doc_id: str
    prescription_notes: str

class UpdateMedication(BaseModel):
    drug_name: str
    dosage: str
    route: str
    frequency: str
    quantity: str
    refill: str
    instructions: str
    start_date: str
    end_date: str
    medication_status: str
class UpdateAllergy(BaseModel):
    allergen: str
    reaction: str
    severity: str
    comment: str

