from typing import List
from fastapi import APIRouter,Depends,status,HTTPException
from models import doctorModel
from schemas import doctorSchema, userSchema
import database, oauth2
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/doctor",
    tags=['Doctor']
)

get_db = database.get_db

# <!-- 
# | =================================================================================
# |                               ADD DOCTOR
# | =================================================================================
# -->
@router.post('/addDoctor', status_code=status.HTTP_201_CREATED)
def add_doctor(request: doctorSchema.AddDoctor,db: Session = Depends(get_db)):
    new_doctor = doctorModel.Doctor(first_name     = request.first_name,
                                    middle_name     = request.middle_name,
                                    last_name       = request.last_name,
                                    department      = request.department,
                                    contact_number  = request.contact_number,
                                    region          = request.region,
                                    street          = request.street,
                                    barangay        = request.barangay,
                                    municipality    = request.municipality,
                                    province        = request.province)
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    return new_doctor


# <!-- 
# | =================================================================================
# |                               GET ONE DOCTOR
# | =================================================================================
# -->
@router.get('/{doc_id}', response_model=doctorSchema.DoctorDetail)
def get_user(doc_id:str,db: Session = Depends(get_db)):
    doc = db.query(doctorModel.Doctor).filter(doctorModel.Doctor.doc_id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Doctor with the id {doc_id} is not available")
    return doc

# <!-- 
# | =================================================================================
# |                               GET ALL DOCTOR
# | =================================================================================
# -->
@router.get('/')
def get_all(db: Session = Depends(get_db)):
    doctor = db.query(doctorModel.Doctor).all()
    return doctor
