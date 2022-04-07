from typing import List
from fastapi import APIRouter,Depends,status,HTTPException,Request,BackgroundTasks
from models import patientModel, recordModel, doctorModel
from schemas import patientSchema, userSchema, recordSchema
import database, oauth2
from sqlalchemy.orm import Session, joinedload
from datatables import DataTable
from sqlalchemy import or_


router = APIRouter(
    prefix="/patient",
    tags=['Patients']
)

get_db = database.get_db




# <!-- 
# | =================================================================================
# |                               GET ALL PATIENT
# | =================================================================================
# -->
@router.get('/all')
def get_all(request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    patientModel.PatientRegistration.first_name.like('%' + user_input + '%'),
                    patientModel.PatientRegistration.middle_name.like('%' + user_input + '%'),
                    patientModel.PatientRegistration.last_name.like('%' + user_input + '%'),
                    patientModel.PatientRegistration.sex.like('%' + user_input + '%'),
                    patientModel.PatientRegistration.contact_number.like('%' + user_input + '%'),
                    patientModel.PatientRegistration.municipality.like('%' + user_input + '%')
                )
            )

        table = DataTable(dict(request.query_params), patientModel.Patient, db.query(patientModel.Patient), [
            'first_name',
            'sex',
            'contact_number',
            'municipality',
            'patient_id'
        ])

        table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return table.json()
    except Exception as e:
        print(e)





# <!-- 
# | =================================================================================
# |                               ADD PATIENT (++ADD PATIENT RECORD, ADD CALL LOG)
# | =================================================================================
# -->
@router.post('/addPatient', status_code=status.HTTP_201_CREATED)
async def add_patient(request: patientSchema.AddPatient,background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    new_patient = patientModel.PatientRegistration( first_name       = request.first_name,
                                        middle_name     = request.middle_name,
                                        last_name       = request.last_name,
                                        sex             = request.sex,
                                        birthday        = request.birthday,
                                        contact_number  = request.contact_number,
                                        street          = request.street,
                                        barangay        = request.barangay,
                                        municipality    = request.municipality,
                                        province        = request.province,
                                        region          = request.region,
                                        weight          = request.weight,
                                        height          = request.height,
                                        blood_type      = request.blood_type,
                                        guardian        = request.guardian,
                                        patient_type    = request.patient_type)
    db.add(new_patient)
    db.commit()
    patient = db.refresh(new_patient)
    # background_tasks.add_task(add_patient_record, new_patient.patient_id)
    new_record = recordModel.Record(patient_id   = new_patient.patient_id)
    db.add(new_record)
    db.commit()
    record = db.refresh(new_record)

    new_log = recordModel.CallLog(patient_record_id = new_record.patient_record_id)
    db.add(new_log)
    db.commit()
    log = db.refresh(new_log) 

    return new_patient,new_record,new_log

# <!-- 
# | =================================================================================
# |                               GET ONE PATIENT
# | =================================================================================
# -->
@router.get('/{patient_id}', response_model=patientSchema.ShowPatient)
def get_user(patient_id:str,db: Session = Depends(get_db)):
    patient = db.query(patientModel.PatientRegistration).filter(patientModel.PatientRegistration.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Doctor with the id {patient_id} is not available")
    return patient

# <!-- 
# | =================================================================================
# |                               UPDATE PATIENT
# | =================================================================================
# -->
@router.put('/updateDetails/{patient_id}', status_code=status.HTTP_202_ACCEPTED)
def updatePatient(patient_id: str, request: patientSchema.UpdatePatient,db: Session = Depends(get_db)):
    if not db.query(patientModel.PatientRegistration).filter(patientModel.PatientRegistration.patient_id == patient_id).update({
        'first_name'      : request.first_name,
        'middle_name'     : request.middle_name,
        'last_name'       : request.last_name,
        'sex'             : request.sex,
        'birthday'        : request.birthday,
        'contact_number'  : request.contact_number,
        'street'          : request.street,
        'barangay'        : request.barangay,
        'municipality'    : request.municipality,
        'province'        : request.province,
        'region'          : request.region,
        'weight'          : request.weight,
        'height'          : request.height,
        'blood_type'      : request.blood_type,
        'guardian'        : request.guardian,
        'patient_type'    : request.patient_type 
    }):
        raise HTTPException(404, 'User to update is not found')
    db.commit()
    updated_patient = db.query(patientModel.PatientRegistration).filter(patientModel.PatientRegistration.patient_id == patient_id).first()
    return updated_patient





  
















# <!-- 
# | =================================================================================
# |                               FOR PATIENT ACCOUNT
# | =================================================================================
# -->




# <!-- 
# | =================================================================================
# |                               FOR PATIENT ACCOUNT
# | =================================================================================
# -->

@router.get('/patientSide/{patient_id}')
def get_one_patient(patient_id: str,request: Request, db: Session = Depends(get_db)):  
        record = db.query(recordModel.Record).options(joinedload(recordModel.Record.patientrecordFK)).filter(recordModel.Record.patient_id ==  patient_id).first()
        
        return record