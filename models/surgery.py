from pydantic.main import BaseModel
from sqlalchemy.sql.operators import notendswith_op
from models.recordModel import Record
from sqlalchemy import String, DateTime, text, Text, Numeric
from sqlalchemy.sql.sqltypes import Date
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base




# <!-- 
# | =================================================================================
# |                               Surgery Type  
# | =================================================================================
# -->


class SurgeryType(Base):
    __tablename__ = "surgery_types"

    id          = Column(String(36), primary_key=True, default=text('UUID()'))
    name        = Column(String(100), unique=True)
    description = Column(Text)
    # price       = Column(Numeric(15,2))


    is_active   = Column(String(100), default='ACTIVE')
    created_at  = Column(DateTime, default=text('NOW()'))
    updated_at  = Column(DateTime, onupdate=text('NOW()'))


    surgeries   = relationship("Surgery", back_populates="surgery_type")



# <!-- 
# | =================================================================================
# |                               Surgery 
# | =================================================================================
# -->
class Surgery(Base):
    __tablename__ = "surgeries"

    id              = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id = Column(String(36), ForeignKey('patient_records.patient_record_id'))
    # surgery_no      = Column(String(100))
    # inpatient_id    = Column(String(36), ForeignKey("inpatients.id"))

    # TODO: room as FK to rooms table
    # room            = Column(String(100))

    surgery_type_id = Column(String(36), ForeignKey("surgery_types.id"))
    start_time      = Column(DateTime)
    end_time        = Column(DateTime)

    # head_surgeon_id = Column(String(36), ForeignKey("users.id"))
    description     = Column(String(255))

    is_active       = Column(String(100), default='Active')
    status          = Column(String(100), default='Pending')
    created_at      = Column(DateTime, default=text('NOW()'))
    updated_at      = Column(DateTime, onupdate=text('NOW()'))


    # inpatient = relationship('InPatient', back_populates='surgeries')
    surgery_type    = relationship("SurgeryType", back_populates="surgeries")
    surgeryFK       = relationship("Record", back_populates="surgeryrecordFK")

    # in_charge = relationship('SurgeryInCharge', back_populates="surgery")



