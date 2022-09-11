from fastapi.responses import HTMLResponse
from typing import List
from fastapi import APIRouter,Depends,status,HTTPException,Request,BackgroundTasks,File,UploadFile,Form
from send_email import send_email_background,send_email_reject
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
    prefix="/request",
    tags=['Record Request']
)
get_db = database.get_db

# #mount static folder
# app.mount('/static', StaticFiles(directory='static'), name='static')

# test
@router.post("/uploadfile")
async def create_upload_file(file: UploadFile = File(...),db: Session = Depends(get_db)):
    FILEPATH = "./static/images/"
    filename = file.filename
    extension = filename.split(".")[1]
    if extension not in ["png","jpg","jpeg"]:
        raise HTTPException(404, "file extension not allowed")

    token_name = secrets.token_hex(10)+"."+extension
    generated_name = FILEPATH + token_name
    file_content = await file.read()
    with open(generated_name, "wb") as file:
        file.write(file_content)


    # PILLOW
    img = Image.open(generated_name)
    img = img.resize(size =(200, 200))
    img.save(generated_name)

    file.close
    file_url = "localhost:8003"+ generated_name[1:]

    new_row = requestModel.Test(image = token_name)
    db.add(new_row)
    db.commit()
    db.refresh(new_row)
    return new_row
    



#get one request
@router.get('/GetOneRequest/{request_id}')
def get_one_request(request_id:str,db: Session = Depends(get_db)):
    request_result = db.query(requestModel.Request).filter(requestModel.Request.request_id ==  request_id).first()
    return request_result

# upload patient valid id
@router.post("/uploadfile/patientValidID")
async def add_patient_valid_id(file: UploadFile = File(...),db: Session = Depends(get_db)):
    FILEPATH = "./static/app/files/"
    filename = file.filename
    extension = filename.split(".")[1]
    if extension not in ["png","jpg","jpeg","bmp","gif"]:
        raise HTTPException(404, "file extension not allowed")

    token_name = secrets.token_hex(10)+"."+extension
    generated_name = FILEPATH + token_name
    file_content = await file.read()
    with open(generated_name, "wb") as file:
        file.write(file_content)


    # PILLOW
    img = Image.open(generated_name)
    img = img.resize(size =(200, 200))
    img.save(generated_name)

    file.close
    file_url = "localhost:8003"+ generated_name[1:]

    patient_valid_id = requestModel.Request(patient_valid_id = token_name)
    db.add(patient_valid_id)
    db.commit()
    db.refresh(patient_valid_id)
    return patient_valid_id

# request datatable
@router.get('/allRequest')
def get_all_request(request: Request, db: Session = Depends(get_db)):
    try:
        
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    requestModel.Request.requester_first_name.like('%' + user_input + '%'),
                    requestModel.Request.requester_last_name.like('%' + user_input + '%'),
                    requestModel.Request.requester_relationship.like('%' + user_input + '%'),
                    requestModel.Request.disclosure_reason.like('%' + user_input + '%'),
                    requestModel.Request.created_at.like('%' + user_input + '%'),
                    requestModel.Request.active_status.like('%' + user_input + '%')
                )
            )

        request_table = DataTable(dict(request.query_params), requestModel.Request, db.query(requestModel.Request).filter(requestModel.Request.active_status != 'Deleted').order_by(requestModel.Request.created_at.desc()), [
            'requester_first_name',
            'requester_last_name',
            'requester_relationship',
            'disclosure_reason',
            'created_at',
            'active_status',
            'request_id'
        ])

        request_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return request_table.json()
    except Exception as e:
        print(e)

# pending request datatable
@router.get('/allRequest/pending')
def get_all_pending_request(request: Request, db: Session = Depends(get_db)):
    try:
        
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    requestModel.Request.requester_first_name.like('%' + user_input + '%'),
                    requestModel.Request.requester_last_name.like('%' + user_input + '%'),
                    requestModel.Request.requester_relationship.like('%' + user_input + '%'),
                    requestModel.Request.disclosure_reason.like('%' + user_input + '%'),
                    requestModel.Request.created_at.like('%' + user_input + '%'),
                    requestModel.Request.active_status.like('%' + user_input + '%')
                )
            )

        pending_request_table = DataTable(dict(request.query_params), requestModel.Request, db.query(requestModel.Request).filter(requestModel.Request.active_status == 'Pending').order_by(requestModel.Request.updated_at.desc()), [
            'requester_first_name',
            'requester_last_name',
            'requester_relationship',
            'disclosure_reason',
            'created_at',
            'active_status',
            'request_id'
        ])

        pending_request_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return pending_request_table.json()
    except Exception as e:
        print(e)



# upload requester valid id
@router.put("/uploadfile/requesterValidID/{request_id}")
async def add_requester_valid_id(request_id: str,file: UploadFile = File(...),db: Session = Depends(get_db)):
    FILEPATH = "./static/app/files/"
    filename = file.filename
    extension = filename.split(".")[1]
    if extension not in ["png","jpg","jpeg","bmp","gif"]:
        raise HTTPException(404, "file extension not allowed")

    token_name = secrets.token_hex(10)+"."+extension
    generated_name = FILEPATH + token_name
    file_content = await file.read()
    with open(generated_name, "wb") as file:
        file.write(file_content)


    # PILLOW
    img = Image.open(generated_name)
    img = img.resize(size =(200, 200))
    img.save(generated_name)

    file.close
    file_url = "localhost:8003"+ generated_name[1:]


    if not db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).update({
                                                    'requester_valid_id': token_name,
                                                    }):
        raise HTTPException(404, 'Request row Not found')
    db.commit()
    requester_valid_id = db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).first()
    return requester_valid_id

# upload requester letter
@router.put("/uploadfile/requesterLetter/{request_id}")
async def add_requester_letter(request_id: str,file: UploadFile = File(...),db: Session = Depends(get_db)):
    FILEPATH = "./static/app/files/"
    filename = file.filename
    extension = filename.split(".")[1]
    # if extension not in ["png","jpg","jpeg","bmp","gif"]:
    #     raise HTTPException(404, "file extension not allowed")

    token_name = secrets.token_hex(10)+"."+extension
    generated_name = FILEPATH + token_name
    file_content = await file.read()
    with open(generated_name, "wb") as file:
        # shutil.copyfileobj(file.file, fileObj)
        file.write(file_content)

    if extension in ["png","jpg","jpeg","bmp","gif"]:
        # # PILLOW
        img = Image.open(generated_name)
        img = img.resize(size =(200, 200))
        img.save(generated_name)

    file.close
    file_url = "localhost:8003"+ generated_name[1:]


    if not db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).update({
                                                    'requester_letter': token_name,
                                                    }):
        raise HTTPException(404, 'Request row Not found')
    db.commit()
    requester_letter = db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).first()
    return requester_letter

#update request fields
@router.put('/updateRequest/{request_id}', status_code=status.HTTP_202_ACCEPTED)
def updateRequest(request_id: str, request: requestSchema.RequestFormSchema,db: Session = Depends(get_db)):
    if not db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).update({
                                                    'patient_first_name': request.patient_first_name,
                                                    'patient_last_name': request.patient_last_name,
                                                    'patient_record_id': request.patient_record_id,
                                                    'patient_email': request.patient_email,
                                                    'patient_phone': request.patient_phone,
                                                    'patient_birth_date': request.patient_birth_date,
                                                    'patient_gender': request.patient_gender,
                                                    'requester_first_name': request.requester_first_name,
                                                    'requester_last_name': request.requester_last_name,
                                                    'requester_relationship': request.requester_relationship,
                                                    'requester_birth_date': request.requester_birth_date,
                                                    'requester_gender': request.requester_gender,
                                                    'requester_email': request.requester_email,
                                                    'requester_phone': request.requester_phone,
                                                    'house_number': request.house_number,
                                                    'street': request.street,
                                                    'barangay': request.barangay,
                                                    'municipality': request.municipality,
                                                    'province': request.province,
                                                    'request_information': request.request_information,
                                                    'disclosure_reason': request.disclosure_reason,
                                                    'delivery': request.delivery
                                                    }):
        raise HTTPException(404, 'Request is not found')
    db.commit()
    requestRecord = db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).first()
    return requestRecord

@router.get("/test/{patient_record_id}", response_class=HTMLResponse)
async def read_item(patient_record_id:str,request: Request,db: Session = Depends(get_db)):
    record = db.query(recordModel.Record).options(joinedload(recordModel.Record.historyrecordFK),
                                        joinedload(recordModel.Record.patientrecordFK),
                                        joinedload(recordModel.Record.problemrecordFK),
                                        joinedload(recordModel.Record.diagnosisrecordFK),
                                        joinedload(recordModel.Record.labresultrecordFK),
                                        joinedload(recordModel.Record.call_logrecordFK),
                                        joinedload(recordModel.Record.prescriptionrecordFK).joinedload(recordModel.Prescription.docprescriptionFK),
                                        joinedload(recordModel.Record.progressnoterecordFK)).filter(recordModel.Record.patient_record_id == patient_record_id).first()
    info = db.query(requestModel.Request).filter(requestModel.Request.patient_record_id == record.record_id).first()   
    diagnosis = db.query(recordModel.Diagnosis).options(joinedload(recordModel.Diagnosis.docdiagnosisFK)).filter(recordModel.Diagnosis.patient_record_id == patient_record_id).all()
    doctor = db.query(doctorModel.Doctor).all()
    today = date.today()
    return templates.TemplateResponse("record_email.html", {"request": request, 
                                                            'record': record,
                                                            'diagnosis': diagnosis,
                                                            'doctor': doctor,
                                                            'info': info,
                                                            'date': today})

#approve request
@router.put('/approvePatientRequest/{request_id}', status_code=status.HTTP_202_ACCEPTED)
def approveRequest(request_id: str, request: requestSchema.ApproveSchema,background_tasks: BackgroundTasks,db: Session = Depends(get_db)):
    
    checkrecord = db.query(recordModel.Record).options(joinedload(recordModel.Record.patientrecordFK)).filter(recordModel.Record.patient_id == request.patient_id).first()
    
    if not checkrecord:
        if not db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).update({
                                                    'active_status': 'Rejected',
                                                    'review_reason': 'Requested information not existing.'
                                                    }):
            raise HTTPException(404, 'Request is not found')
        db.commit()
        return 404

    if not ((checkrecord.patientrecordFK.first_name == request.patient_first_name) and (checkrecord.patientrecordFK.last_name == request.patient_last_name)):
        if not db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).update({
                                                    'active_status': 'Rejected',
                                                    'reason': 'No patient record match.'
                                                    }):
            raise HTTPException(404, 'Request is not found')
        db.commit()
        message = 'there are no patient record match to your request in our records.'
        send_email_reject(background_tasks, 'Medical Records', request.requester_email,message)
        return 403
    
    if request.delivery == 'Email':
        file_name = "static/app/pdf/"+request.patient_first_name+'_'+request.patient_last_name+'_'+secrets.token_hex(10)+".pdf"
        send_email_background(background_tasks, 'Medical Records', request.requester_email,checkrecord.patient_record_id,file_name)
    if request.delivery != 'Email':
        message = 'the request you have sent is approved and you can now visit the hospital to get the copies of records.'
        send_email_reject(background_tasks, 'Medical Records', request.requester_email,message)
    if not db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).update({
                                                    'active_status': 'Approved'
                                                    }):
        raise HTTPException(404, 'Request is not found')
    db.commit()
    # updated_medicalProblem = db.query(recordModel.Problem).filter(recordModel.Problem.problem_id == problem_id).first()
    # return updated_medicalProblem
    return 202


#reject request
@router.put('/rejectRequest/{request_id}', status_code=status.HTTP_202_ACCEPTED)
def approveRequest(request_id: str, request: requestSchema.rejectSchema,background_tasks: BackgroundTasks,db: Session = Depends(get_db)):
    if not db.query(requestModel.Request).filter(requestModel.Request.request_id == request_id).update({
                                                    'active_status': 'Rejected',
                                                    'reason': request.reason
                                                    }):
            raise HTTPException(404, 'Request is not found')
    db.commit()
    message = 'the request you have sent is rejected due to'+ request.reason +'.'
    send_email_reject(background_tasks, 'Medical Records', request.requester_email,message)
    return 202
