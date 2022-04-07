from sqlalchemy import Integer, String, DateTime, text
from sqlalchemy.sql.schema import Column
from sqlalchemy.orm import relationship
from database import Base


# <!-- 
# | =================================================================================
# |                               DOCTOR TABLE
# | =================================================================================
# -->
class Doctor(Base):
    __tablename__ = 'doctors'

    doc_id          = Column(String(36), primary_key=True, default=text('UUID()'))
    first_name      = Column(String(255), nullable=False)
    middle_name     = Column(String(255), nullable=True)
    last_name       = Column(String(255), nullable=False)
    department      = Column(String(255), nullable=False)
    contact_number  = Column(String(255), nullable=False)
    region          = Column(String(255), nullable=False)
    street          = Column(String(255), nullable=False)
    barangay        = Column(String(255), nullable=False)
    municipality    = Column(String(255), nullable=False)
    province        = Column(String(255), nullable=False)
    active_status   = Column(String(255), nullable=False, default="Active")
    created_at      = Column(DateTime, default=text('NOW()'))
    updated_at      = Column(DateTime, onupdate=text('NOW()'))

    diagnosisdocFK        = relationship('Diagnosis', back_populates="docdiagnosisFK")
    progressnoteFK        = relationship('ProgressNote', back_populates="docentryFK")
    doctorprescriptionFK  = relationship('Prescription', back_populates="docprescriptionFK")   

    doctor_profilesFK    = relationship('UserProfile', back_populates='docProfileFK')



