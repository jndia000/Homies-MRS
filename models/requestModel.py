from sqlalchemy import Integer, String, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Date
from database import Base





class Request(Base):
    __tablename__ = 'requests'

    request_id              = Column(String(36), primary_key=True, default=text('UUID()'))
    review_by               = Column(String(36), ForeignKey('users.user_id'))
    patient_id              = Column(String(36), ForeignKey('patient_registration.patient_id'))
    request_information     = Column(String(255), nullable=True)
    disclosure_reason       = Column(String(255), nullable=True)
    delivery                = Column(String(255), nullable=True)
    email                   = Column(String(255), nullable=True)
    requested_file          = Column(String(255), nullable=True)
    review_reason           = Column(String(255), nullable=True)
    active_status           = Column(String(255), nullable=False, default="Pending")
    created_at              = Column(DateTime, nullable=True, default=text('NOW()'))
    updated_at              = Column(DateTime, nullable=True, onupdate=text('NOW()'))

    reviewbyFK = relationship('User', back_populates='requestreviewFK')
    requesterFK = relationship('PatientRegistration', back_populates='patientrequestFK')
