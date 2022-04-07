from sqlalchemy import Integer, String, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Date
from database import Base
from models.doctorModel import Doctor
from models.patientModel import PatientRegistration

# <!-- 
# | =================================================================================
# |                               USER TYPE TABLE
# | =================================================================================
# -->

class UserType(Base):
    __tablename__ = 'user_types'

    user_type_id    = Column(String(36), primary_key=True, default=text('UUID()'))
    title           = Column(String(255), nullable=False)
    active_status   = Column(String(255), nullable=False, default="Active")
    created_at      = Column(DateTime, default=text('NOW()'))
    updated_at      = Column(DateTime, onupdate=text('NOW()'))

    userstypeFK = relationship('User', back_populates='user_typesFK')
    
# <!-- 
# | =================================================================================
# |                               USER TABLE
# | =================================================================================
# -->

class User(Base):
    __tablename__ = 'users'

    user_id         = Column(String(36), primary_key=True, default=text('UUID()'))
    user_type_id    = Column(String(36), ForeignKey('user_types.user_type_id'))
    email           = Column(String(255), nullable=False)
    password        = Column(String(255), nullable=False)
    active_status   = Column(String(255), nullable=False, default="Active")
    created_at      = Column(DateTime, nullable=True, default=text('NOW()'))
    updated_at      = Column(DateTime, nullable=True, onupdate=text('NOW()'))

    user_typesFK    = relationship('UserType', back_populates="userstypeFK")
    # user_profilesFK = relationship('UserProfile', back_populates="usersFK")
    # byusersFK       = relationship('Record', back_populates="created_byFK")
    users_profilesFK = relationship('UserProfile', back_populates='usersFK')
    requestreviewFK = relationship('Request', back_populates='reviewbyFK')



# <!-- 
# | =================================================================================
# |                               USER PROFILE TABLE
# | =================================================================================
# -->

class UserProfile(Base):
    __tablename__ = 'user_profiles'

    user_profile_id         = Column(String(36), primary_key=True, default=text('UUID()'))
    user_id                 = Column(String(36), ForeignKey('users.user_id'))
    patient_id              = Column(String(36), ForeignKey('patient_registration.patient_id'))
    doc_id                  = Column(String(36), ForeignKey('doctors.doc_id'))
    first_name              = Column(String(255), nullable=False)
    middle_name             = Column(String(255), nullable=True)
    last_name               = Column(String(255), nullable=False)
    suffix_name             = Column(String(255), nullable=True)
    birth_date              = Column(Date, nullable=False)
    region                  = Column(String(255), nullable=False)
    street                  = Column(String(255), nullable=False)
    barangay                = Column(String(255), nullable=False)
    municipality            = Column(String(255), nullable=False)
    province                = Column(String(255), nullable=False)
    created_at              = Column(DateTime, nullable=True, default=text('NOW()'))
    updated_at              = Column(DateTime, nullable=True, onupdate=text('NOW()'))

    # usersFK = relationship('User', back_populates='users_profilesFK')
    usersFK             = relationship('User', back_populates='users_profilesFK')
    patientProfileFK    = relationship('PatientRegistration', back_populates='patient_profilesFK')
    docProfileFK        = relationship('Doctor', back_populates='doctor_profilesFK')
