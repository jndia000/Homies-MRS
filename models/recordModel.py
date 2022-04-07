from pydantic.main import BaseModel
from sqlalchemy.sql.operators import notendswith_op
from models.userModel import User
from sqlalchemy import Integer, String, DateTime, text
from sqlalchemy.sql.sqltypes import Date
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import os
import base64
import secrets

# <!-- 
# | =================================================================================
# |                               PATIENT RECORDS TABLE
# | =================================================================================
# -->

class Record(Base):
    __tablename__ = 'patient_records'

    patient_record_id       = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_id              = Column(String(36), ForeignKey('patient_registration.patient_id'))
    # record_id               = Column(String(8), default=base64.b64encode(os.urandom(6)).decode('ascii'))
    # record_id               = Column(String(8), default=text('UUID()'))
    created_at              = Column(DateTime, default=text('NOW()'))
    updated_at              = Column(DateTime, onupdate=text('NOW()'))


    #created_byFK            = relationship('User', back_populates="byusersFK")
    patientrecordFK         = relationship('PatientRegistration', back_populates="patientFK")

    #historyrecordFK         = relationship('History', back_populates="historyFK")
    problemrecordFK         = relationship('Problem', back_populates="problemFK")
    diagnosisrecordFK       = relationship('Diagnosis', back_populates="diagnosisrecFK")
    labresultrecordFK       = relationship('LabResult', back_populates="labresultFK")
    surgeryrecordFK         = relationship("Surgery", back_populates="surgeryFK")
    prescriptionrecordFK    = relationship('Prescription', back_populates="prescriptionsFK")
    progressnoterecordFK    = relationship('ProgressNote', back_populates="progressnoteFK")

    record_allergyFK        = relationship('Allergy', back_populates="allergiesFK")
    record_immunizationFK   = relationship('Immunization', back_populates="immunizationsFK")
    record_medicationFK     = relationship('Medication', back_populates="medicationsFK")
    record_attachmentFK     = relationship('Attachment', back_populates="attachmentsFK")

    call_logrecordFK        = relationship('CallLog', back_populates="call_logFK")

    #inpatient_table
    inpatientFK             = relationship('Inpatient', back_populates="record_inpatientFK")
    outpatientFK            = relationship('Outpatient', back_populates="record_outpatientFK")



# <!-- 
# | =================================================================================
# |                               HISTORY TABLE
# | =================================================================================
# -->

class History(Base):
    __tablename__ = 'medical_history'

    history_id              = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_id              = Column(String(36), ForeignKey('patient_registration.patient_id'))
    # patient_record_id       = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    chief_complaint         = Column(String(255), nullable=True)
    previous_hospital       = Column(String(255), nullable=True)
    previous_doctor         = Column(String(255), nullable=True)
    previous_diagnosis      = Column(String(255), nullable=True)
    previous_treatment      = Column(String(255), nullable=True)
    previous_surgeries      = Column(String(255), nullable=True)
    previous_medication     = Column(String(255), nullable=True)
    health_conditions       = Column(String(255), nullable=True)
    special_privileges      = Column(String(255), nullable=True)
    family_history          = Column(String(255), nullable=True)
    created_at              = Column(DateTime, default=text('NOW()'))
    updated_at              = Column(DateTime, onupdate=text('NOW()'))

    historyFK               = relationship('PatientRegistration', back_populates="historyrecordFK")

# <!-- 
# | =================================================================================
# |                               PROBLEM TABLE
# | =================================================================================
# -->

class Problem(Base):
    __tablename__ = 'problems'

    problem_id              = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id       = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    problem_name            = Column(String(255), nullable=False)
    problem_note            = Column(String(255), nullable=False)
    active_status           = Column(String(255), nullable=False)
    date_occured            = Column(Date, nullable=False)
    date_resolved           = Column(Date, nullable=True)
    created_at              = Column(DateTime, default=text('NOW()'))
    updated_at              = Column(DateTime, onupdate=text('NOW()'))
    
    problemFK               = relationship('Record', back_populates="problemrecordFK")

# <!-- 
# | =================================================================================
# |                               DIAGNOSIS TABLE
# | =================================================================================
# -->

class Diagnosis(Base):
    __tablename__ = 'diagnosis'

    diagnosis_id      = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    doc_id            = Column(String(36), ForeignKey('doctors.doc_id'))
    diagnosis               = Column(String(255), nullable=False)
    description             = Column(String(255), nullable=False)
    

    docdiagnosisFK     = relationship('Doctor', back_populates="diagnosisdocFK")
   #diagnosisFK        = relationship('DiagnosisDetail', back_populates="dianosisdetailFK")
    diagnosisrecFK     = relationship('Record', back_populates="diagnosisrecordFK")


# <!-- 
# | =================================================================================
# |                               LAB RESULT TABLE
# | =================================================================================
# -->

class LabResult(Base):
    __tablename__ = 'lab_results'

    lab_result_id       = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id   = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    specimen            = Column(String(255), nullable=False)
    result              = Column(String(255), nullable=False)
    reference           = Column(String(255), nullable=False)
    unit                = Column(String(255), nullable=False)
    status              = Column(String(255), nullable=False, default='Processing')
    detailed_result     = Column(String(255), nullable=False)

    labresultFK     = relationship('Record', back_populates="labresultrecordFK")


# <!-- 
# | =================================================================================
# |                               PRESCRIPTION TABLE
# | =================================================================================
# -->

class Prescription(Base):
    __tablename__ = 'prescriptions'

    prescription_id           = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id         = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    med_id                    = Column(String(255),ForeignKey('medicine.id'))
    supply_id                 = Column(String(255),ForeignKey('medicalsupplies.id'))
    medication_type           = Column(String(255), nullable=True)
    dosage                    = Column(String(255), nullable=True)
    quantity                  = Column(String(255), nullable=False)
    frequency                 = Column(String(255), nullable=True)
    route                     = Column(String(255), nullable=True)
    doc_id                    = Column(String(36), ForeignKey('doctors.doc_id'))
    prescription_notes        = Column(String(255), nullable=False)
    #additional column
    # prescription_no           = Column(String(255), nullable=False,unique=True, index=True)
    date_prescribed           = Column(Date,nullable=False, default=text('NOW()'))
    # status                    = Column(String(255),nullable=False, default="Evaluating")
    created_at                = Column(DateTime, default=text('NOW()'))
    updated_at                = Column(DateTime, onupdate=text('NOW()'))
    

    docprescriptionFK       = relationship('Doctor', back_populates="doctorprescriptionFK")    
    #prescriptiondetailsFK   = relationship('PrescriptionDetail', back_populates="prescribeFK")
    prescriptionsFK         = relationship('Record', back_populates="prescriptionrecordFK")
    medicineFK              = relationship('Medicine', back_populates="medicinerecordFK")
    supplyFK                = relationship('MedicalSupplies', back_populates="supplyrecordFK")

# <!-- 
# | =================================================================================
# |                               PROGRESS NOTES TABLE
# | =================================================================================
# -->

class ProgressNote(Base):
    __tablename__ = 'progress_notes'

    progress_note_id        = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id       = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    # progress_note_id    =  Column(String(36), ForeignKey('progress_notes.progress_note_id'))
    doc_id                  =  Column(String(36), ForeignKey('doctors.doc_id'))
    reason_for_consultation = Column(String(255), nullable=False)
    physical_examination    = Column(String(255), nullable=False)
    impression              = Column(String(255), nullable=False)
    recommendation          = Column(String(255), nullable=False)
    consultation_date        = Column(Date, nullable=True)
    next_appointment        = Column(Date, nullable=True)
    created_at              = Column(DateTime, default=text('NOW()'))
    updated_at              = Column(DateTime, onupdate=text('NOW()'))
    
   # progressdetailFK    = relationship('ProgressNoteDetail', back_populates="progressFK")
    progressnoteFK          = relationship('Record', back_populates="progressnoterecordFK")
    docentryFK              = relationship('Doctor',back_populates="progressnoteFK")


# <!-- 
# | =================================================================================
# |                               PATIENT CALL LOGS TABLE
# | =================================================================================
# -->

class CallLog(Base):
    __tablename__ = 'patient_call_logs'

    patient_call_log_id     = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id       = Column(String(36), ForeignKey('patient_records.patient_record_id'))

    call_logFK              = relationship('Record', back_populates="call_logrecordFK")
    logsFK                  = relationship('CallLogDetail', back_populates="call_logsFK")

# <!-- 
# | =================================================================================
# |                               PATIENT CALL LOG DETAIL TABLE
# | =================================================================================
# -->

class CallLogDetail(Base):
    __tablename__ = 'patient_call_log_details'

    call_log_detail_id     = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_call_log_id    = Column(String(36), ForeignKey('patient_call_logs.patient_call_log_id'))
    call_log_date          = Column(Date, nullable=False)
    # payor_called           = Column(String(255), nullable=False)
    contact_first_name     = Column(String(255), nullable=False)
    contact_last_name      = Column(String(255), nullable=False)
    contact_phone          = Column(String(255), nullable=False)
    call_details           = Column(String(255), nullable=False)
    follow_up_date         = Column(Date, nullable=True)
    created_at             = Column(DateTime, default=text('NOW()'))
    updated_at             = Column(DateTime, onupdate=text('NOW()'))

    call_logsFK            = relationship('CallLog', back_populates="logsFK")

# <!-- 
# | =================================================================================
# |                               ALLERGIES TABLE
# | =================================================================================
# -->

class Allergy(Base):
    __tablename__ = 'allergies'

    allergy_id             = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id      = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    allergen               = Column(String(255), nullable=True)
    reaction               = Column(String(255), nullable=True)
    severity               = Column(String(255), nullable=True)
    comment                = Column(String(255), nullable=True)
    created_at             = Column(DateTime, default=text('NOW()'))
    updated_at             = Column(DateTime, onupdate=text('NOW()'))

    allergiesFK            = relationship('Record', back_populates="record_allergyFK")

# <!-- 
# | =================================================================================
# |                               IMMUNIZATION TABLE
# | =================================================================================
# -->

class Immunization(Base):
    __tablename__ = 'immunizations'

    immunization_id        = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id      = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    vaccine                = Column(String(255), nullable=True)
    type                   = Column(String(255), nullable=True)
    date_given             = Column(Date, nullable=True)
    administered_by        = Column(String(255), nullable=True)
    created_at             = Column(DateTime, default=text('NOW()'))
    updated_at             = Column(DateTime, onupdate=text('NOW()'))

    immunizationsFK        = relationship('Record', back_populates="record_immunizationFK")

# <!-- 
# | =================================================================================
# |                               MEDICATION TABLE
# | =================================================================================
# -->

class Medication(Base):
    __tablename__ = 'medications'

    medication_id          = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id      = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    drug_name              = Column(String(255), nullable=True)
    dosage                 = Column(String(255), nullable=True)
    route                  = Column(String(255), nullable=True)
    frequency              = Column(String(255), nullable=True)
    quantity               = Column(String(255), nullable=True)
    refill                 = Column(String(255), nullable=True)
    instructions           = Column(String(255), nullable=True)
    start_date             = Column(Date, nullable=True)
    end_date               = Column(Date, nullable=True)
    medication_status      = Column(String(255), nullable=True, default="Active")
    created_at             = Column(DateTime, default=text('NOW()'))
    updated_at             = Column(DateTime, onupdate=text('NOW()'))

    medicationsFK          = relationship('Record', back_populates="record_medicationFK")

# <!-- 
# | =================================================================================
# |                               ATTACHMENT TABLE
# | =================================================================================
# -->

class Attachment(Base):
    __tablename__ = 'attachments'

    attachment_id          = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id      = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    attachment             = Column(String(255), nullable=True)
    type                   = Column(String(255), nullable=True)
    created_at             = Column(DateTime, default=text('NOW()'))
    updated_at             = Column(DateTime, onupdate=text('NOW()'))

    attachmentsFK          = relationship('Record', back_populates="record_attachmentFK")