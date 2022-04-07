from typing import List
from fastapi import APIRouter,Depends,status,HTTPException,Request,BackgroundTasks
from models import doctorModel, patientModel, recordModel
from schemas import patientSchema, userSchema
import database, oauth2
from sqlalchemy.orm import Session, joinedload
from datatables import DataTable
from sqlalchemy import or_


router = APIRouter(
    prefix="/discharge",
    tags=['Discharge']
)

get_db = database.get_db



# <!-- 
# | =================================================================================
# |                               ADD DISCHARGE
# | =================================================================================
# -->
@router.post('/AddPatientDischarge', status_code=status.HTTP_201_CREATED)
def add_patient_discharge(request: patientSchema.AddDischarge, db: Session = Depends(get_db)):
    new_discharge = patientModel.Discharge (patient_id               = request.patient_id,
                                            reason_of_admittance     = request.reason_of_admittance,
                                            diagnosis_at_admittance  = request.diagnosis_at_admittance,
                                            date_admitted            = request.date_admitted,
                                            treatment_summary        = request.treatment_summary,
                                            discharge_date           = request.discharge_date,
                                            physician_approved       = request.physician_approved,
                                            discharge_diagnosis      = request.discharge_diagnosis,
                                            further_treatment_plan   = request.further_treatment_plan,
                                            next_check_up_date     = request.next_check_up_update,
                                            client_consent_approval  = request.client_consent_approval,
                                            ending_date              = request.ending_date,
                                            active_status            = request.active_status,)
    db.add(new_discharge)
    db.commit()
    db.refresh(new_discharge)
    
    return new_discharge



# <!-- 
# | =================================================================================
# |                               GET ALL DISCHARGE
# | =================================================================================
# -->
@router.get('/allDischarge')
def get_all_discharge(request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    # patientModel.Discharge.patient_name.like('%' + user_input + '%'),
                    # patientModel.Patient.middle_name.like('%' + user_input + '%'),
                    # patientModel.Patient.last_name.like('%' + user_input + '%'),
                    patientModel.Discharge.reason_of_admittance .like('%' + user_input + '%'),
                    patientModel.Discharge.treatment_summary.like('%' + user_input + '%'),
                    patientModel.Discharge.physician_approved.like('%' + user_input + '%')
                )
            )

        table = DataTable(dict(request.query_params), patientModel.Discharge, db.query(patientModel.Discharge), [
            'patient_name',
            'reason_of_admittance',
            'treatment_summary',
            'physician_approved'   
        ])

        table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return table.json()
    except Exception as e:
        print(e)
        


# <!-- 
# | =================================================================================
# |                               GET ONE DISCHARGE
# | =================================================================================
# -->
@router.get('/dischargepatient/{discharge_id}')
def get_discharge_user(discharge_id:str,db: Session = Depends(get_db)):
    discharge = db.query(patientModel.Discharge).options(joinedload(patientModel.Discharge.dischargeFK)).filter(patientModel.Discharge.discharge_id == discharge_id).first()
    if not discharge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Doctor with the id {discharge_id} is not available")
    return discharge

@router.put('/updateDischarge/{discharge_id}', status_code=status.HTTP_202_ACCEPTED)
def updateDischarge(discharge_id: str, request: patientSchema.UpdateDischarge,db: Session = Depends(get_db)):
    if not db.query(patientModel.Discharge).filter(patientModel.Discharge.discharge_id == discharge_id).update({
                                            'reason_of_admittance'     : request.reason_of_admittance,
                                            'diagnosis_at_admittance'  : request.diagnosis_at_admittance,
                                            'date_admitted'            : request.date_admitted,
                                            'treatment_summary'        : request.treatment_summary,
                                            'discharge_date'           : request.discharge_date,
                                            'physician_approved'       : request.physician_approved,
                                            'discharge_diagnosis'      : request.discharge_diagnosis,
                                            'further_treatment_plan'   : request.further_treatment_plan,
                                            'next_check_up_date'       : request.next_check_up_date,
                                            'client_consent_approval'  : request.client_consent_approval,
                                            'ending_date'              : request.ending_date,
                                            'active_status'            : request.active_status,
    }):
        raise HTTPException(404, 'User to update is not found')
    db.commit()
    updated_discharge = db.query(patientModel.Discharge).filter(patientModel.Discharge.discharge_id == discharge_id).first()
    return updated_discharge



    

  
