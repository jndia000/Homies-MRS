from sqlalchemy import Integer, String, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Date
from database import Base


# <!-- 
# | =================================================================================
# |                               PATIENT TABLE
# | =================================================================================
# -->
class PatientRegistration(Base):
    __tablename__ = 'patient_registration'

    patient_id      = Column(String(36), primary_key=True, default=text('UUID()'))
    first_name      = Column(String(255), nullable=False)
    middle_name     = Column(String(255), nullable=True)
    last_name       = Column(String(255), nullable=False)
    sex             = Column(String(255), nullable=False)
    birthday        = Column(Date, nullable=False)
    weight          = Column(String(255), nullable=False)
    height          = Column(String(255), nullable=False)
    blood_type      = Column(String(255), nullable=False)
    guardian        = Column(String(255), nullable=False)
    region          = Column(String(255), nullable=False)
    street          = Column(String(255), nullable=False)
    barangay        = Column(String(255), nullable=False)
    municipality    = Column(String(255), nullable=False)
    province        = Column(String(255), nullable=False)
    contact_number  = Column(String(255), nullable=False)
    # hospital_employee = Column(String(255), nullable=False)
    # medical_history_number = Column(String(36), ForeignKey('medical_history.medical_history_number'), nullable=True)
    # dp_id = Column(String(36), ForeignKey('discount_privillages.dp_id'), nullable=True)
    patient_type = Column(String(255), nullable=True)
    
    
    active_status   = Column(String(255), nullable=False, default="Active")
    created_at      = Column(DateTime, default=text('NOW()'))
    updated_at      = Column(DateTime, onupdate=text('NOW()'))

    patientFK             = relationship('Record', back_populates="patientrecordFK")
    patientdischargeFK    = relationship('Discharge', back_populates="dischargeFK")

    patient_profilesFK    = relationship('UserProfile', back_populates='patientProfileFK')
    patientrequestFK      = relationship('Request', back_populates='requesterFK')

    historyrecordFK         = relationship('History', back_populates="historyFK")






# <!-- 
# | =================================================================================
# |                               DISCHARGE TABLE
# | =================================================================================
# -->
class Discharge(Base):
    __tablename__ = 'discharges'

    discharge_id             = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_id               = Column(String(36), ForeignKey('patient_registration.patient_id'))
    reason_of_admittance     = Column(String(255), nullable=True)
    diagnosis_at_admittance  = Column(String(255), nullable=True)
    date_admitted            = Column(Date, nullable=True)
    treatment_summary        = Column(String(255), nullable=True)
    discharge_date           = Column(Date, nullable=True)
    physician_approved       = Column(String(255), nullable=True)
    discharge_diagnosis      = Column(String(255), nullable=True)
    further_treatment_plan   = Column(String(255), nullable=True)
    next_check_up_date     = Column(String(255), nullable=True)
    client_consent_approval  = Column(String(255), nullable=True)
    ending_date              = Column(String(255), nullable=True)
    active_status            = Column(String(255), nullable=True, default="Active")
    created_at               = Column(DateTime, default=text('NOW()'))
    updated_at               = Column(DateTime, onupdate=text('NOW()'))

    dischargeFK    = relationship('PatientRegistration', back_populates="patientdischargeFK")


 # <!-- 
# | =================================================================================
# |                               INPATIENT TABLE
# | =================================================================================
# -->
class Inpatient(Base):
    __tablename__ = 'inpatients'

    admission_id = Column(String(255), primary_key=True, default=text('UUID()'))
    inpatient_no = Column(String(255), nullable=False)
    record_id  = Column(String(255), ForeignKey('patient_records.patient_record_id'), nullable=True)
    #room_number = Column(String(36), ForeignKey('rooms.room_id'), nullable=False)
    # room_type = Column(String(255), nullable=True)
    date_admitted = Column(DateTime, default=text('NOW()'))
    reason_of_admittance = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    diagnosis = Column(String(255), nullable=True)
    tests = Column(String(255), nullable=True)
    treatments = Column(String(255), nullable=True)
    surgery = Column(String(255), nullable=True)
    # medication = Column(String(255), nullable=True)
    # dosage = Column(String(255), nullable=True)
    # frequency = Column(String(255), nullable=True)
    # ending_date = Column(Date, nullable=True)
    status = Column(String(255),nullable=True, default="Active")
    is_accepting_visits = Column(String(255), nullable=True)
    patient_status = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    record_inpatientFK             = relationship('Record', back_populates="inpatientFK")

    #room = relationship('Room', foreign_keys=[room_number])
    #patientrecordsFK = relationship('Record', foreign_keys=[record_id])
    #favor na idagdag
    #my_prescriptions = relationship("Prescription", primaryjoin="and_(Inpatient.admission_id==Prescription.admission_id)",back_populates="inpatient_FK")


    # <!-- 
# | =================================================================================
# |                               OUTPATIENT TABLE
# | =================================================================================
# -->

class Outpatient(Base):
    __tablename__ = 'outpatients'

    outpatient_id = Column(String(255), primary_key=True, default=text('UUID()'))
    outpatient_no = Column(String(255), nullable=False)
    record_id  = Column(String(255), ForeignKey('patient_records.patient_record_id'), nullable=True)
    walk_in_date = Column(DateTime, default=text('NOW()'))
    purpose = Column(String(255), nullable=False)
    test = Column(String(255), nullable=True)
    treatment_summary = Column(String(255), nullable=True)
    # medication = Column(String(255), nullable=True)
    # dosage = Column(String(255), nullable=True)
    # frequency = Column(String(255), nullable=True)
    # ending_date = Column(Date, nullable=True)
    diagnosis = Column(String(255), nullable=True)
    status = Column(String(255),nullable=True, default="Active")
    patient_status = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    record_outpatientFK             = relationship('Record', back_populates="outpatientFK")
    #patientrecordsFK = relationship('Record')
