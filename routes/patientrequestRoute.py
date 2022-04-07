from fastapi.responses import HTMLResponse
from typing import List
from fastapi import APIRouter,Depends,status,HTTPException,Request,BackgroundTasks,File,UploadFile,Form
from send_email import send_email_background,record_request_pdf,send_email_reject
from fastapi.openapi.models import Reference
from models import recordModel,patientModel,doctorModel,requestModel
from schemas import recordSchema, userSchema, patientSchema, requestSchema
import database, oauth2
from datatables import DataTable
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from datetime import date
import secrets, shutil
from PIL import Image
templates = Jinja2Templates(directory="templates")
router = APIRouter(
    prefix="/recordRequest",
    tags=['Patient Request']
)
get_db = database.get_db




# <!-- 
# | =================================================================================
# |                               PATIENT REQUEST -- ADMIN
# | =================================================================================
# -->


# <!-- 
# | =================================================================================
# |                               PATIENT REQUEST DATATABLE
# | =================================================================================
# -->
@router.get('/allPatientRequest')
def get_all_patient_request(request: Request, db: Session = Depends(get_db)):
    try:
        
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    requestModel.Request.request_information.like('%' + user_input + '%'),
                    requestModel.Request.delivery.like('%' + user_input + '%'),
                    patientModel.PatientRegistration.first_name.like('%' + user_input + '%'),
                    patientModel.PatientRegistration.last_name.like('%' + user_input + '%'),
                    requestModel.Request.disclosure_reason.like('%' + user_input + '%'),
                    requestModel.Request.created_at.like('%' + user_input + '%'),
                    requestModel.Request.active_status.like('%' + user_input + '%')
                )
            )

        request_table = DataTable(dict(request.query_params), requestModel.Request, db.query(requestModel.Request).
                                                            options(joinedload(requestModel.Request.requesterFK)).
                                                            order_by(requestModel.Request.active_status.asc()), [
            ('first_name', 'requesterFK.first_name' ),
            ('last_name', 'requesterFK.last_name' ),
            'request_information',
            'created_at',
            'active_status',
            'requested_file',
            'request_id'
        ])

        request_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return request_table.json()
    except Exception as e:
        print(e)
# <!-- 
# | =================================================================================
# |                               PATIENT REQUEST DATATABLE - PENDING
# | =================================================================================
# -->
@router.get('/pendingPatientRequest')
def get_all_pending_patient_request(request: Request, db: Session = Depends(get_db)):
    try:
        
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    requestModel.Request.request_information.like('%' + user_input + '%'),
                    requestModel.Request.delivery.like('%' + user_input + '%'),
                    patientModel.PatientRegistration.first_name.like('%' + user_input + '%'),
                    patientModel.PatientRegistration.last_name.like('%' + user_input + '%'),
                    requestModel.Request.disclosure_reason.like('%' + user_input + '%'),
                    requestModel.Request.created_at.like('%' + user_input + '%'),
                    requestModel.Request.active_status.like('%' + user_input + '%')
                )
            )

        request_table = DataTable(dict(request.query_params), requestModel.Request, db.query(requestModel.Request)
                                                            .options(joinedload(requestModel.Request.requesterFK))
                                                            .filter(requestModel.Request.active_status == 'Pending'), [
            ('first_name', 'requesterFK.first_name' ),
            ('last_name', 'requesterFK.last_name' ),
            'request_information',
            'created_at',
            'active_status',
            'request_id'
        ])

        request_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return request_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               GET ONE PATIENT REQUEST 
# | =================================================================================
# -->
@router.get('/GetOnePatientRequest/{request_id}')
def get_one_patient_request(request_id:str,db: Session = Depends(get_db)):
    request_result = db.query(requestModel.Request).options(joinedload(requestModel.Request.requesterFK)).filter(requestModel.Request.request_id ==  request_id).first()
    return request_result



# <!-- 
# | =================================================================================
# |                               APPROVE PATIENT REQUEST 
# | =================================================================================
# -->
@router.get("/emailRecord/{request_id}/{patient_id}")
async def get_record_request(request_id:str,patient_id:str,request: Request,db: Session = Depends(get_db)):
    info = db.query(requestModel.Request).filter(requestModel.Request.request_id ==  request_id).first()
    record = db.query(recordModel.Record).options(
                                        joinedload(recordModel.Record.patientrecordFK),
                                        joinedload(recordModel.Record.problemrecordFK),
                                        joinedload(recordModel.Record.diagnosisrecordFK),
                                        joinedload(recordModel.Record.labresultrecordFK),
                                        joinedload(recordModel.Record.call_logrecordFK),
                                        joinedload(recordModel.Record.prescriptionrecordFK).joinedload(recordModel.Prescription.docprescriptionFK),
                                        joinedload(recordModel.Record.progressnoterecordFK)).filter(recordModel.Record.patient_id == patient_id).first()
    history = db.query(recordModel.History).filter(recordModel.History.patient_id == patient_id).first()
    diagnosis = db.query(recordModel.Diagnosis).options(joinedload(recordModel.Diagnosis.docdiagnosisFK)).filter(recordModel.Diagnosis.patient_record_id == record.patient_record_id).all()
    doctor = db.query(doctorModel.Doctor).all()
    today = date.today()
    return templates.TemplateResponse("record_email.html", {"request": request, 
                                                            'record': record,
                                                            'history': history,
                                                            'diagnosis': diagnosis,
                                                            'doctor': doctor,
                                                            'info': info,
                                                            'date': today})

# <!-- 
# | =================================================================================
# |                               APPROVE PATIENT REQUEST 
# | =================================================================================
# -->
@router.put('/approveRequest/{request_id}', status_code=status.HTTP_202_ACCEPTED)
def approveRequest(request_id: str, request: requestSchema.ApproveSchema,background_tasks: BackgroundTasks,db: Session = Depends(get_db)):
    
    checkrecord = db.query(recordModel.Record).options(joinedload(recordModel.Record.patientrecordFK)).filter(recordModel.Record.patient_id == request.patient_id).first()
    
    if not checkrecord:
        if not db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).update({
                                                    'active_status': 'Rejected',
                                                    'reason': 'Requested information not existing.'
                                                    }):
            raise HTTPException(404, 'Request is not found')
        db.commit()
        return 404
    if request.delivery == 'Email':
        file = checkrecord.patientrecordFK.first_name+'-'+checkrecord.patientrecordFK.last_name+'-'+secrets.token_hex(10)+".pdf"
        file_name = "static/app/pdf/"+file
        requester = checkrecord.patientrecordFK.first_name+' '+checkrecord.patientrecordFK.last_name
        send_email_background(background_tasks, 'Medical Records', request.email,request_id,request.patient_id,file_name,requester)
    if request.delivery == 'Patient Account' or request.delivery == "Standard Pick-up":
        file = checkrecord.patientrecordFK.first_name+'-'+checkrecord.patientrecordFK.last_name+'-'+secrets.token_hex(10)+".pdf"
        file_name = "static/app/pdf/"+file
        record_request_pdf(background_tasks, request_id,request.patient_id,file_name)
    if not db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).update({
                                                    'active_status': 'Approved',
                                                    'requested_file': file
                                                    }):
        raise HTTPException(404, 'Request is not found')
    db.commit()
    # updated_medicalProblem = db.query(recordModel.Problem).filter(recordModel.Problem.problem_id == problem_id).first()
    # return updated_medicalProblem
    return 202































































# <!-- 
# | =================================================================================
# |                              PATIENT REQUEST DATATABLE
# | =================================================================================
# -->
@router.get('/patientRequest/{patient_id}')
def get_patient_request(patient_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    requestModel.Request.request_information.like('%' + user_input + '%'),
                    requestModel.Request.disclosure_reason.like('%' + user_input + '%'),
                    requestModel.Request.delivery.like('%' + user_input + '%'),
                )
            )

        log_table = DataTable(dict(request.query_params), requestModel.Request, db.query(requestModel.Request).
                                                        filter(requestModel.Request.patient_id == patient_id).
                                                        order_by(requestModel.Request.active_status.asc()), [
            ('created_at'),
            ('active_status'),
            ('request_information'),
            ('disclosure_reason'),
            ('requested_file'),
            ('request_id')

        ])

        log_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return log_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                             PENDING PATIENT REQUEST DATATABLE
# | =================================================================================
# -->
@router.get('/patientPendingRequest/{patient_id}')
def get_patient_request(patient_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    requestModel.Request.request_information.like('%' + user_input + '%'),
                    requestModel.Request.disclosure_reason.like('%' + user_input + '%'),
                    requestModel.Request.delivery.like('%' + user_input + '%'),
                )
            )

        log_table = DataTable(dict(request.query_params), requestModel.Request, db.query(requestModel.Request).
                                                        filter((requestModel.Request.patient_id == patient_id), (requestModel.Request.active_status == 'Pending')).
                                                        order_by(requestModel.Request.active_status.asc()), [
            ('created_at'),
            ('active_status'),
            ('request_information'),
            ('disclosure_reason'),
            ('requested_file'),
            ('request_id')

        ])

        log_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return log_table.json()
    except Exception as e:
        print(e)




# <!-- 
# | =================================================================================
# |                               ADD PATIENT REQUEST
# | =================================================================================
# -->
@router.post('/addpatientRequest', status_code=status.HTTP_201_CREATED)
def add_patient_request(request: requestSchema.patientRequest,db: Session = Depends(get_db)):
    new_record_request = requestModel.Request(patient_id                     = request.patient_id,
                                                        request_information  = request.request_information,
                                                        disclosure_reason    = request.disclosure_reason,
                                                        delivery             = request.delivery,
                                                        email                = request.email)
    db.add(new_record_request)
    db.commit()
    db.refresh(new_record_request)
    return new_record_request

# <!-- 
# | =================================================================================
# |                               GET ONE PATIENT ROUTE
# | =================================================================================
# -->
@router.get('/ShowPatientRequest/{request_id}')
def get_one_patient_request(request_id:str,db: Session = Depends(get_db)):
    patient_request = db.query(requestModel.Request).filter(requestModel.Request.request_id ==  request_id).first()
    return patient_request


# <!-- 
# | =================================================================================
# |                               CANCEL PATIENT REQUEST (cancel and reject)
# | =================================================================================
# -->

@router.put('/statusRequest/{request_id}', status_code=status.HTTP_202_ACCEPTED)
def cancelRequest(request_id: str, request: requestSchema.rejectSchema,db: Session = Depends(get_db)):
    if not db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).update({
                                                    'active_status': request.active_status,
                                                    'review_reason': request.review_reason
                                                    }):
            raise HTTPException(404, 'Request is not found')
    db.commit()
    return 202




