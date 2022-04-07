from pydantic.main import BaseModel
from sqlalchemy.sql.operators import notendswith_op
from models.userModel import User
from sqlalchemy import Integer, String, DateTime, text
from sqlalchemy.sql.sqltypes import Date
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base



# <!-- 
# | =================================================================================
# |                              MEDICINE TABLE
# | =================================================================================
# -->

class Medicine(Base):
    __tablename__= 'medicine'

    id               = Column(String(36), primary_key=True, default=text('UUID()'))
    med_product_name = Column(String(255), nullable=False)
    created_at       = Column(DateTime,nullable=False, default=text('NOW()'))
    updated_at       = Column(DateTime,nullable=True, default=text('NOW()'))

    medicinerecordFK       = relationship('Prescription', back_populates="medicineFK")




# <!-- 
# | =================================================================================
# |                              MEDICAL SUPPLIES TABLE
# | =================================================================================
# -->

class MedicalSupplies(Base):
    __tablename__ = 'medicalsupplies'

    id              = Column(String(36), primary_key=True, default=text('UUID()'))
    ms_product_name = Column (String(255), unique=True,nullable=False)
    created_at      = Column(DateTime,nullable=False, default=text('NOW()'))
    updated_at      = Column(DateTime,nullable=True, default=text('NOW()'))

    supplyrecordFK                = relationship('Prescription', back_populates="supplyFK")


