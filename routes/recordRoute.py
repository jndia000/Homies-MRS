import re
from typing import List
from fastapi import APIRouter,Depends,status,HTTPException,Request,BackgroundTasks,File,UploadFile
from fastapi.openapi.models import Reference
from models import recordModel,patientModel,doctorModel,surgery,presModel
from schemas import recordSchema, userSchema, patientSchema,presSchema
import database, oauth2
from sqlalchemy.orm import Session, joinedload
from datatables import DataTable
from sqlalchemy import or_
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import secrets
from PIL import Image
templates = Jinja2Templates(directory="templates")
router = APIRouter(
    prefix="/record",
    tags=['Medical Records']
)

get_db = database.get_db


# <!-- 
# | =================================================================================
# |                               ADD MEDICINE (POPULATE MEDICINE LIST)
# | =================================================================================
# -->
@router.post('/AddMedicine', status_code=status.HTTP_201_CREATED)
def add_med(request: presSchema.AddMedicine,db: Session = Depends(get_db)):
    new_med = presModel.Medicine(med_product_name      = request.med_product_name)
    db.add(new_med)
    db.commit()
    db.refresh(new_med)
    return new_med

# <!-- 
# | =================================================================================
# |                               ADD SUPPLY (POPULATE SUPPLY LIST)
# | =================================================================================
# -->
@router.post('/AddSupply', status_code=status.HTTP_201_CREATED)
def add_supply(request: presSchema.AddSupply,db: Session = Depends(get_db)):
    new_supply = presModel.MedicalSupplies(ms_product_name      = request.ms_product_name)
    db.add(new_supply)
    db.commit()
    db.refresh(new_supply)
    return new_supply


# <!-- 
# | =================================================================================
# |                               GET ONE PRESCRIPTION DRUG
# | =================================================================================
# -->
@router.get('/ShowPrescriptionDrug/{prescription_id}')
def get_all_prescription_drug(prescription_id:str,db: Session = Depends(get_db)):
    prescription_drug = db.query(recordModel.Prescription).options(joinedload(recordModel.Prescription.docprescriptionFK),
                                                                    joinedload(recordModel.Prescription.medicineFK)).filter(recordModel.Prescription.prescription_id ==  prescription_id).first()
    return prescription_drug

# <!-- 
# | =================================================================================
# |                               GET ONE PATIENT RECORD
# | =================================================================================
# -->
@router.get('/patientRecord/{patient_record_id}')
def get_all_record(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        
        
        record = db.query(recordModel.Record).filter(recordModel.Record.patient_record_id == patient_record_id).first()
        
        # diagnosis = db.query(recordModel.Diagnosis).options(joinedload(recordModel.Diagnosis.docdiagnosisFK)).filter(recordModel.Diagnosis.patient_record_id == patient_record_id).all()
        # doctor = db.query(doctorModel.Doctor).all()
        return templates.TemplateResponse('sidenav/patientRecord/viewpatientrecord1.html',{
            'request': request,
            'record': record,
            # 'diagnosis': diagnosis,
            # 'doctor': doctor,
        })
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               GET ONE PATIENT RECORD
# | =================================================================================
# -->
@router.post('/patientRecord')
def get_all_(request: recordSchema.patientRecord, db: Session = Depends(get_db)):  
        record = db.query(recordModel.Record).options(
                                        joinedload(recordModel.Record.patientrecordFK),
                                        joinedload(recordModel.Record.problemrecordFK),
                                        joinedload(recordModel.Record.diagnosisrecordFK),
                                        joinedload(recordModel.Record.labresultrecordFK),
                                        joinedload(recordModel.Record.record_attachmentFK),
                                        joinedload(recordModel.Record.call_logrecordFK),
                                        joinedload(recordModel.Record.prescriptionrecordFK).joinedload(recordModel.Prescription.docprescriptionFK),
                                        joinedload(recordModel.Record.progressnoterecordFK)).filter(recordModel.Record.patient_record_id == request.patient_record_id).first()
        
        diagnosis = db.query(recordModel.Diagnosis).options(joinedload(recordModel.Diagnosis.docdiagnosisFK)).filter(recordModel.Diagnosis.patient_record_id == request.patient_record_id).all()
        doctor = db.query(doctorModel.Doctor).order_by(doctorModel.Doctor.department.asc()).all()
        supply = db.query(presModel.Medicine).order_by(presModel.Medicine.med_product_name.asc()).all()
        medicine = db.query(presModel.MedicalSupplies).order_by(presModel.MedicalSupplies.ms_product_name.asc()).all()
        history = db.query(recordModel.History).filter(recordModel.History.patient_id == request.patient_id).first()
        return record, diagnosis, doctor, history, supply, medicine  
    # if not record:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
    #                         detail=f"Record with the id {patient_record_id} is not available")
    # return record


# <!-- 
# | =================================================================================
# |                               GET ONE PATIENT CALL LOG
# | =================================================================================
# -->
@router.get('/patientCallLog/{patient_record_id}')
def get_all_log(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        
        logs = db.query(recordModel.CallLog).options(joinedload(recordModel.CallLog.call_logFK),
                                        joinedload(recordModel.CallLog.logsFK)).filter(recordModel.CallLog.patient_record_id == patient_record_id).first()
        
        
        return templates.TemplateResponse('sidenav/patientRecord/patientcalllogs.html',{
            'request': request,
            'logs': logs
        })
    except Exception as e:
        print(e)


# <!-- 
# | =================================================================================
# |                               ADD PATIENT RECORD
# | =================================================================================
# -->
@router.post('/addRecord', status_code=status.HTTP_201_CREATED)
def add_record(request: recordSchema.AddRecord,db: Session = Depends(get_db)):
    check_record = db.query(recordModel.Record).filter(recordModel.Record.patient_id == request.patient_id).first()
    if check_record: 
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=f"Patient with the id {request.patient_id} has an existing record")
    else:
        new_record = recordModel.Record(patient_id     = request.patient_id)
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
    return new_record




# <!-- 
# | =================================================================================
# |                               ADD CALL LOG
# | =================================================================================
# -->
@router.post('/log', status_code=status.HTTP_201_CREATED)
def add_log(request: recordSchema.AddLog,db: Session = Depends(get_db)):
    new_call_log = recordModel.CallLog(patient_record_id      = request.patient_record_id)
    db.add(new_call_log)
    db.commit()
    db.refresh(new_call_log)
    return new_call_log

# <!-- 
# | =================================================================================
# |                               ADD CALL LOG DETAIL
# | =================================================================================
# -->
@router.post('/logDetail', status_code=status.HTTP_201_CREATED)
def add_log_detail(request: recordSchema.AddLogDetail,db: Session = Depends(get_db)):
    new_call_log_detail = recordModel.CallLogDetail(patient_call_log_id      = request.patient_call_log_id,
                                        call_log_date           = request.call_log_date,
                                        # payor_called            = request.payor_called,
                                        contact_first_name      = request.contact_first_name,
                                        contact_last_name       = request.contact_last_name,
                                        contact_phone           = request.contact_phone,
                                        call_details            = request.call_details,
                                        follow_up_date          = request.follow_up_date)  
    db.add(new_call_log_detail)
    db.commit()
    db.refresh(new_call_log_detail)
    return new_call_log_detail

# <!-- 
# | =================================================================================
# |                               ADD MEDICATION
# | =================================================================================
# -->
@router.post('/recordMedication', status_code=status.HTTP_201_CREATED)
def add_record_medication(request: recordSchema.AddMedication,db: Session = Depends(get_db)):
    new_record_medication = recordModel.Medication(patient_record_id        = request.patient_record_id,
                                                    drug_name               = request.drug_name,
                                                    dosage                  = request.dosage,
                                                    route                   = request.route,
                                                    frequency               = request.frequency,
                                                    quantity                = request.quantity,
                                                    refill                  = request.refill,
                                                    instructions            = request.instructions,
                                                    start_date              = request.start_date,
                                                    end_date                = request.end_date,
                                                    medication_status       = request.medication_status)
    db.add(new_record_medication)
    db.commit()
    db.refresh(new_record_medication)
    return new_record_medication

# <!-- 
# | =================================================================================
# |                               ADD ALLERGY
# | =================================================================================
# -->
@router.post('/recordAllergy', status_code=status.HTTP_201_CREATED)
def add_record_allergy(request: recordSchema.AddAllergy,db: Session = Depends(get_db)):
    new_record_allergy = recordModel.Allergy(patient_record_id        = request.patient_record_id,
                                                    allergen             = request.allergen,
                                                    reaction             = request.reaction,
                                                    severity             = request.severity,
                                                    comment              = request.comment)
    db.add(new_record_allergy)
    db.commit()
    db.refresh(new_record_allergy)
    return new_record_allergy

# <!-- 
# | =================================================================================
# |                               ADD IMMUNIZATION
# | =================================================================================
# -->
@router.post('/recordImmunization', status_code=status.HTTP_201_CREATED)
def add_record_immunization(request: recordSchema.AddImmunization,db: Session = Depends(get_db)):
    new_record_immunization = recordModel.Immunization(patient_record_id        = request.patient_record_id,
                                                    vaccine                     = request.vaccine,
                                                    type                        = request.type,
                                                    date_given                  = request.date_given,
                                                    administered_by             = request.administered_by)
    db.add(new_record_immunization)
    db.commit()
    db.refresh(new_record_immunization)
    return new_record_immunization



# <!-- 
# | =================================================================================
# |                               ADD HISTORY
# | =================================================================================
# -->
@router.post('/medicalHistory', status_code=status.HTTP_201_CREATED)
def add_record_history(request: recordSchema.AddHistory,db: Session = Depends(get_db)):
    new_record_history = recordModel.History(patient_id             = request.patient_id,
                                            chief_complaint         = request.chief_complaint,
                                            previous_hospital       = request.previous_hospital,
                                            previous_doctor         = request.previous_doctor,
                                            previous_diagnosis      = request.previous_diagnosis,
                                            previous_treatment      = request.previous_treatment,
                                            previous_surgeries      = request.previous_surgeries,
                                            previous_medication     = request.previous_medication,
                                            health_conditions       = request.health_conditions,
                                            special_privileges      = request.special_privileges,
                                            family_history          = request.family_history)
    db.add(new_record_history)
    db.commit()
    db.refresh(new_record_history)
    return new_record_history

# <!-- 
# | =================================================================================
# |                               ADD PROBLEM
# | =================================================================================
# -->
@router.post('/medicalProblem', status_code=status.HTTP_201_CREATED)
def add_record_problem(request: recordSchema.AddProblem,db: Session = Depends(get_db)):
    new_record_problem = recordModel.Problem(patient_record_id      = request.patient_record_id,
                                            problem_name            = request.problem_name,
                                            active_status           = request.active_status,
                                            problem_note            = request.problem_note,
                                            date_occured            = request.date_occured,
                                            date_resolved           = request.date_resolved)
    db.add(new_record_problem)
    db.commit()
    db.refresh(new_record_problem)
    return new_record_problem

# <!-- 
# | =================================================================================
# |                               ADD DIAGNOSIS
# | =================================================================================
# -->
@router.post('/medicalDiagnosis', status_code=status.HTTP_201_CREATED)
def add_record_diagnosis(request: recordSchema.AddDiagnosis,db: Session = Depends(get_db)):
    doctor = db.query(doctorModel.Doctor).filter(doctorModel.Doctor.doc_id == request.doc_id).first()
    doctor = doctor.first_name+' '+doctor.last_name 
    new_record_diagnosis = recordModel.Diagnosis(patient_record_id      = request.patient_record_id,
                                                doc_id                  = request.doc_id, 
                                                description= request.description, 
                                                diagnosis= request.diagnosis)
    db.add(new_record_diagnosis)
    db.commit()
    db.refresh(new_record_diagnosis)

    return new_record_diagnosis,doctor

# <!-- 
# | =================================================================================
# |                               ADD LAB RESULT
# | =================================================================================
# -->
@router.post('/medicalLabResult', status_code=status.HTTP_201_CREATED)
def add_record_lab_result(request: recordSchema.AddLabResult,db: Session = Depends(get_db)):
    new_record_lab_result = recordModel.LabResult(patient_record_id      = request.patient_record_id,
                                                    specimen             = request.specimen,
                                                    result               = request.result,
                                                    reference            = request.reference,
                                                    unit                 = request.unit,
                                                    status               = request.status,
                                                    detailed_result     = request.detailed_result )
    db.add(new_record_lab_result)
    db.commit()
    db.refresh(new_record_lab_result)
    return new_record_lab_result

# <!-- 
# | =================================================================================
# |                               ADD Surgery Type
# | =================================================================================
# -->
@router.post('/surgery_type', status_code=status.HTTP_201_CREATED)
def add_surgery_type(request: recordSchema.AddSurgeryType,db: Session = Depends(get_db)):
    new_surgery_type = surgery.SurgeryType (name            = request.name,
                                            description     = request.description,)
    db.add(new_surgery_type)
    db.commit()
    db.refresh(new_surgery_type)
    return new_surgery_type

# <!-- 
# | =================================================================================
# |                               ADD Surgery
# | =================================================================================
# -->
@router.post('/surgery', status_code=status.HTTP_201_CREATED)
def add_surgery(request: recordSchema.AddSurgery,db: Session = Depends(get_db)):
    new_surgery = surgery.Surgery    (patient_record_id     = request.patient_record_id,
                                            surgery_type_id = request.surgery_type_id,
                                            start_time      = request.start_time,
                                            end_time        = request.end_time,
                                            description     = request.description,)
    db.add(new_surgery)
    db.commit()
    db.refresh(new_surgery)
    return new_surgery

# <!-- 
# | =================================================================================
# |                               ADD PRESCRIPTION[DRUG]
# | =================================================================================
# -->
@router.post('/medicalPrescription', status_code=status.HTTP_201_CREATED)
def add_record_prescription(request: recordSchema.AddPrescription,db: Session = Depends(get_db)):
    new_record_prescription = recordModel.Prescription(patient_record_id      = request.patient_record_id,
                                                        med_id               = request.med_id,
                                                        medication_type      = request.medication_type,
                                                        dosage               = request.dosage,
                                                        quantity             = request.quantity,
                                                        frequency            = request.frequency,
                                                        route                = request.route,
                                                        doc_id               = request.doc_id,
                                                        date_prescribed      = request.date_prescribed,
                                                        prescription_notes   = request.prescription_notes)
    db.add(new_record_prescription)
    db.commit()
    db.refresh(new_record_prescription)
    return new_record_prescription

# <!-- 
# | =================================================================================
# |                               ADD PRESCRIPTION[SUPPLY]
# | =================================================================================
# -->
@router.post('/medicalPrescriptionSupply', status_code=status.HTTP_201_CREATED)
def add_record_prescription_supply(request: recordSchema.AddPrescriptionSupply,db: Session = Depends(get_db)):
    new_record_prescription_s = recordModel.Prescription(patient_record_id      = request.patient_record_id,
                                                        supply_id            = request.supply_id,
                                                        medication_type      = request.medication_type,
                                                        quantity             = request.quantity,
                                                        doc_id               = request.doc_id,
                                                        date_prescribed      = request.date_prescribed,
                                                        prescription_notes   = request.prescription_notes)
    db.add(new_record_prescription_s)
    db.commit()
    db.refresh(new_record_prescription_s)
    return new_record_prescription_s



# <!-- 
# | =================================================================================
# |                               ADD PROGRESS NOTES
# | =================================================================================
# -->
@router.post('/medicalProgressNote', status_code=status.HTTP_201_CREATED)
def add_record_progress_note(request: recordSchema.AddProgressNote,db: Session = Depends(get_db)):
    new_record_progress_note = recordModel.ProgressNote(patient_record_id      = request.patient_record_id,
                                                        doc_id                 = request.doc_id,
                                                        reason_for_consultation = request.reason_for_consultation,
                                                        physical_examination   = request.physical_examination,
                                                        impression              = request.impression,
                                                        recommendation          = request.recommendation,
                                                        consultation_date       = request.consultation_date,
                                                        next_appointment        = request.next_appointment
                                                        )
    db.add(new_record_progress_note)    
    db.commit()
    db.refresh(new_record_progress_note)
    return new_record_progress_note


# <!-- 
# | =================================================================================
# |                               ADD ATTACHMENT (UPLOAD FILE)
# | =================================================================================
# -->
@router.post("/uploadAttachment/upload/{patient_record_id}")
async def add_attachment(patient_record_id:str,file: UploadFile = File(...),db: Session = Depends(get_db)):
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
    img = img.resize(size =(700, 500))
    img.save(generated_name)

    file.close
    file_url = "localhost:8000"+ generated_name[1:]

    attachment = recordModel.Attachment(attachment = token_name, patient_record_id = patient_record_id)
    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return attachment

# <!-- 
# | =================================================================================
# |                               +ADD ATTACHMENT (CONTINUATION OF UPLOAD FILE)
# | =================================================================================
# -->
@router.put('/recordAttachment/{attachment_id}', status_code=status.HTTP_201_CREATED)
def add_record_attachment(attachment_id: str, request: recordSchema.UpdateAttachment,db: Session = Depends(get_db)):
    if not db.query(recordModel.Attachment).filter(recordModel.Attachment.attachment_id == attachment_id).update({
                                                            'type' : request.type}):
        raise HTTPException(404, 'Upload not successful')
    db.commit()
    new_record_attachment = db.query(recordModel.Attachment).filter(recordModel.Attachment.attachment_id == attachment_id).first()
    return new_record_attachment



# <!-- 
# | =================================================================================
# |                               GET ONE PRESCRIPTION SUPPLY
# | =================================================================================
# -->
@router.get('/ShowPrescriptionSupply/{prescription_id}')
def get_one_prescription_supply(prescription_id:str,db: Session = Depends(get_db)):
    supply = db.query(recordModel.Prescription).options(joinedload(recordModel.Prescription.docprescriptionFK),
                                                        joinedload(recordModel.Prescription.supplyFK)).filter(recordModel.Prescription.prescription_id ==  prescription_id).first()
    return supply

# <!-- 
# | =================================================================================
# |                               GET ALL HISTORY
# | =================================================================================
# -->
@router.get('/showMedicalHistory', response_model=recordSchema.ShowHistory)
def get_all_history(db: Session = Depends(get_db)):
    record = db.query(recordModel.History).all()
    return record

# <!-- 
# | =================================================================================
# |                               GET ALL PROBLEM
# | =================================================================================
# -->
@router.get('/showMedicalProblem', response_model=recordSchema.ShowProblem)
def get_all_problem(db: Session = Depends(get_db)):
    record = db.query(recordModel.Problem).all()
    return record

# <!-- 
# | =================================================================================
# |                               GET ONE DIAGNOSIS
# | =================================================================================
# -->
@router.get('/ShowDiagnosticResult/{diagnosis_id}')
def get_one_diagnostic_result(diagnosis_id:str,db: Session = Depends(get_db)):
    diagnostic_result = db.query(recordModel.Diagnosis).options(joinedload(recordModel.Diagnosis.docdiagnosisFK)).filter(recordModel.Diagnosis.diagnosis_id ==  diagnosis_id).first()
    return diagnostic_result


# <!-- 
# | =================================================================================
# |                               GET ONE PROGRESS NOTES
# | =================================================================================
# -->
@router.get('/ShowProgressNote/{progress_note_id}')
def get_one_progress_note(progress_note_id:str,db: Session = Depends(get_db)):
    progress_note = db.query(recordModel.ProgressNote).filter(recordModel.ProgressNote.progress_note_id ==  progress_note_id).first()
    return progress_note

# <!-- 
# | =================================================================================
# |                               GET ONE PROBLEM
# | =================================================================================
# -->
@router.get('/ShowProblem/{problem_id}')
def get_one_medical_problem(problem_id:str,db: Session = Depends(get_db)):
    medical_problem = db.query(recordModel.Problem).filter(recordModel.Problem.problem_id ==  problem_id).first()
    return medical_problem


# <!-- 
# | =================================================================================
# |                               GET ONE LAB RESULT
# | =================================================================================
# -->
@router.get('/ShowLabResult/{lab_result_id}')
def get_one_lab_result(lab_result_id:str,db: Session = Depends(get_db)):
    lab_result = db.query(recordModel.LabResult).filter(recordModel.LabResult.lab_result_id ==  lab_result_id).first()
    return lab_result

    # <!-- 
# | =================================================================================
# |                               GET ONE SURGERY
# | =================================================================================
# -->
@router.get('/ShowSurgery/{id}')
def get_one_surgery(id:str,db: Session = Depends(get_db)):
    get_surgery = db.query(surgery.Surgery).options(joinedload(surgery.Surgery.surgery_type)).filter(surgery.Surgery.id ==  id).first()
    return get_surgery

# <!-- 
# | =================================================================================
# |                               GET ONE CALL LOG DETAIL
# | =================================================================================
# -->
@router.get('/ShowCallLog/{call_log_detail_id}')
def get_one_call_log(call_log_detail_id:str,db: Session = Depends(get_db)):
    call_log = db.query(recordModel.CallLogDetail).filter(recordModel.CallLogDetail.call_log_detail_id ==  call_log_detail_id).first()
    return call_log

# <!-- 
# | =================================================================================
# |                               GET ALL CALL LOG DETAIL OF PATIENT
# | =================================================================================
# -->
@router.get('/PatientCallLog/{patient_call_log_id}')
def get_all_patient_call_log(patient_call_log_id:str,db: Session = Depends(get_db)):
    call_log = db.query(recordModel.CallLogDetail).options(joinedload(recordModel.CallLogDetail.call_logsFK).options(joinedload(recordModel.CallLog.call_logFK).options(joinedload(recordModel.Record.patientrecordFK)))).filter(recordModel.CallLogDetail.patient_call_log_id ==  patient_call_log_id).order_by(recordModel.CallLogDetail.call_log_date.desc()).all()
    return call_log

# <!-- 
# | =================================================================================
# |                               GET ONE ALLERGY
# | =================================================================================
# -->
@router.get('/ShowAllergy/{allergy_id}')
def get_one_allergy(allergy_id:str,db: Session = Depends(get_db)):
    allergy = db.query(recordModel.Allergy).filter(recordModel.Allergy.allergy_id ==  allergy_id).first()
    return allergy

# <!-- 
# | =================================================================================
# |                               GET ONE MEDICATION
# | =================================================================================
# -->
@router.get('/ShowMedications/{medication_id}')
def get_one_medication(medication_id:str,db: Session = Depends(get_db)):
    medication = db.query(recordModel.Medication).filter(recordModel.Medication.medication_id ==  medication_id).first()
    return medication

# <!-- 
# | =================================================================================
# |                               UPDATE MEDICATION
# | =================================================================================
# -->
@router.put('/updateMedication/{medication_id}', status_code=status.HTTP_202_ACCEPTED)
def update_medication(medication_id: str, request: recordSchema.UpdateMedication,db: Session = Depends(get_db)):
    if not db.query(recordModel.Medication).filter(recordModel.Medication.medication_id == medication_id).update({
                                                    'drug_name': request.drug_name ,
                                                    'dosage': request.dosage ,
                                                    'route': request.route ,
                                                    'frequency': request.frequency,
                                                    'quantity': request.quantity,
                                                    'refill': request.refill,
                                                    'instructions': request.instructions,
                                                    'start_date': request.start_date,
                                                    'end_date': request.end_date,
                                                    'medication_status': request.medication_status
                                                    }):
        raise HTTPException(404, 'Medication not found')
    db.commit()
    updated_medication = db.query(recordModel.Medication).filter(recordModel.Medication.medication_id == medication_id).first()
    return updated_medication

# <!-- 
# | =================================================================================
# |                               UPDATE ALLERGY
# | =================================================================================
# -->
@router.put('/updateAllergy/{allergy_id}', status_code=status.HTTP_202_ACCEPTED)
def update_allergy(allergy_id: str, request: recordSchema.UpdateAllergy,db: Session = Depends(get_db)):
    if not db.query(recordModel.Allergy).filter(recordModel.Allergy.allergy_id == allergy_id).update({
                                                    'allergen': request.allergen ,
                                                    'reaction': request.reaction ,
                                                    'severity': request.severity ,
                                                    'comment': request.comment,

                                                    }):
        raise HTTPException(404, 'Allergy not found')
    db.commit()
    updated_allergy = db.query(recordModel.Allergy).filter(recordModel.Allergy.allergy_id == allergy_id).first()
    return updated_allergy

# <!-- 
# | =================================================================================
# |                               UPDATE HISTORY
# | =================================================================================
# -->
@router.put('/updateMedicalHistory/{history_id}', status_code=status.HTTP_202_ACCEPTED)
def updateMedicalHistory(history_id: str, request: recordSchema.UpdateMedicalHistory,db: Session = Depends(get_db)):
    if not db.query(recordModel.History).filter(recordModel.History.history_id == history_id).update({
                                                    'chief_complaint': request.chief_complaint,
                                                    'medical_history': request.medical_history,
                                                    'allergy': request.allergy,
                                                    'general_physician': request.general_physician,
                                                    'medication': request.medication,
                                                    'family_history': request.family_history
                                                    }):
        raise HTTPException(404, 'User to Medical History is not found')
    db.commit()
    updated_medicalHistory = db.query(recordModel.History).filter(recordModel.History.history_id == history_id).first()
    return updated_medicalHistory

# <!-- 
# | =================================================================================
# |                               UPDATE PROBLEM - ACTIVE STATUS
# | =================================================================================
# -->
@router.put('/updateProblem/{problem_id}', status_code=status.HTTP_202_ACCEPTED)
def updateMedicalProblem(problem_id: str, request: recordSchema.UpdateProblem,db: Session = Depends(get_db)):
    if not db.query(recordModel.Problem).filter(recordModel.Problem.problem_id == problem_id).update({
                                                    'date_resolved': request.date_resolved,
                                                    'active_status': 'Resolved'
                                                    }):
        raise HTTPException(404, 'Medical Problem is not found')
    db.commit()
    updated_medicalProblem = db.query(recordModel.Problem).filter(recordModel.Problem.problem_id == problem_id).first()
    return updated_medicalProblem

# <!-- 
# | =================================================================================
# |                               UPDATE PROBLEM
# | =================================================================================
# -->
@router.put('/updateMedicalProblem/{problem_id}', status_code=status.HTTP_202_ACCEPTED)
def updateProblem(problem_id: str, request: recordSchema.UpdateMedicalProblem,db: Session = Depends(get_db)):
    if not db.query(recordModel.Problem).filter(recordModel.Problem.problem_id == problem_id).update({
                                                    'problem_name': request.problem_name,
                                                    'problem_note': request.problem_note,
                                                    'active_status': request.active_status,
                                                    'date_occured': request.date_occured,
                                                    'date_resolved': request.date_resolved,

                                                    }):
        raise HTTPException(404, 'Medical Problem is not found')
    db.commit()
    updated_Problem = db.query(recordModel.Problem).filter(recordModel.Problem.problem_id == problem_id).first()
    return updated_Problem

# <!-- 
# | =================================================================================
# |                               UPDATE PROGRESS NOTES
# | =================================================================================
# -->
@router.put('/updateProgressNote/{progress_note_id}', status_code=status.HTTP_202_ACCEPTED)
def update_progress_note(progress_note_id: str, request: recordSchema.UpdateProgressNote,db: Session = Depends(get_db)):
    if not db.query(recordModel.ProgressNote).filter(recordModel.ProgressNote.progress_note_id == progress_note_id).update({
                                                    'reason_for_consultation': request.reason_for_consultation,
                                                    'physical_examination': request.physical_examination,
                                                    'impression': request.impression,
                                                    'recommendation': request.recommendation,
                                                    'next_appointment': request.next_appointment,
                                                    'consultation_date': request.consultation_date,
                                                    }):
        raise HTTPException(404, 'Progress Note is not found')
    db.commit()
    updated_progressNote = db.query(recordModel.Problem).filter(recordModel.Problem.problem_id == progress_note_id).first()
    return updated_progressNote


# <!-- 
# | =================================================================================
# |                               UPDATE CALL LOG DETAIL
# | =================================================================================
# -->
@router.put('/updateCallLog/{call_log_detail_id}', status_code=status.HTTP_202_ACCEPTED)
def update_call_log(call_log_detail_id: str, request: recordSchema.UpdateCallLog,db: Session = Depends(get_db)):
    if not db.query(recordModel.CallLogDetail).filter(recordModel.CallLogDetail.call_log_detail_id == call_log_detail_id).update({
                                                    'call_log_date': request.call_log_date,
                                                    'contact_first_name': request.contact_first_name,
                                                    'contact_last_name': request.contact_last_name,
                                                    'contact_phone': request.contact_phone,
                                                    'call_details': request.call_details,
                                                    'follow_up_date': request.follow_up_date
                                                    }):
        raise HTTPException(404, 'Call Log is not found')
    db.commit()
    updated_callLog = db.query(recordModel.CallLogDetail).filter(recordModel.CallLogDetail.call_log_detail_id == call_log_detail_id).first()
    return updated_callLog


# <!-- 
# | =================================================================================
# |                               UPDATE LAB RESULT
# | =================================================================================
# -->
@router.put('/updateLabResult/{lab_result_id}', status_code=status.HTTP_202_ACCEPTED)
def update_lab_result(lab_result_id: str, request: recordSchema.UpdateLabResult,db: Session = Depends(get_db)):
    if not db.query(recordModel.LabResult).filter(recordModel.LabResult.lab_result_id == lab_result_id).update({
                                                    'specimen': request.specimen,
                                                    'result': request.result,
                                                    'reference': request.reference,
                                                    'unit': request.unit,
                                                    'status': request.status,
                                                    'detailed_result': request.detailed_result
                                                    }):
        raise HTTPException(404, 'Laboratory result is not found')
    db.commit()
    updated_labResult = db.query(recordModel.LabResult).filter(recordModel.LabResult.lab_result_id == lab_result_id).first()
    return updated_labResult

# <!-- 
# | =================================================================================
# |                               UPDATE DIAGNOSIS
# | =================================================================================
# -->
@router.put('/updateDiagnosticResult/{diagnosis_id}', status_code=status.HTTP_202_ACCEPTED)
def updateDiagnosis(diagnosis_id: str, request: recordSchema.updateDiagnosis,db: Session = Depends(get_db)):
    if not db.query(recordModel.Diagnosis).filter(recordModel.Diagnosis.diagnosis_id == diagnosis_id).update({
        'doc_id': request.doc_id,
        'diagnosis': request.diagnosis,
        'description': request.description
    }):
        raise HTTPException(404, 'Diagnostic Result is not found')
    db.commit()
    updated_diagnosticResult = db.query(recordModel.Diagnosis).filter(recordModel.Diagnosis.diagnosis_id == diagnosis_id).first()
    return updated_diagnosticResult

# <!-- 
# | =================================================================================
# |                               UPDATE PRESCRIPTION[DRUG]
# | =================================================================================
# -->
@router.put('/updatePrescriptionDrug/{prescription_id}', status_code=status.HTTP_202_ACCEPTED)
def update_medicalPrescription(prescription_id: str, request: recordSchema.UpdatePrescriptionDrug,db: Session = Depends(get_db)):
    if not db.query(recordModel.Prescription).filter(recordModel.Prescription.prescription_id == prescription_id).update({
                                                    'med_id': request.med_id ,
                                                    'dosage': request.dosage ,
                                                    'quantity': request.quantity ,
                                                    'frequency': request.frequency ,
                                                    'route': request.route,
                                                    'doc_id': request.doc_id ,
                                                    'prescription_notes': request.prescription_notes,
                                                    'date_prescribed' : request.date_prescribed
                                                    }):
        raise HTTPException(404, 'Prescription not found')
    db.commit()
    updated_prescription = db.query(recordModel.Prescription).options(joinedload(recordModel.Prescription.medicineFK)).filter(recordModel.Prescription.prescription_id == prescription_id).first()
    return updated_prescription

# <!-- 
# | =================================================================================
# |                               UPDATE PRESCRIPTION[SUPPLY]
# | =================================================================================
# -->
@router.put('/updatePrescriptionSupply/{prescription_id}', status_code=status.HTTP_202_ACCEPTED)
def update_medicalPrescriptionSupply(prescription_id: str, request: recordSchema.UpdatePrescriptionSupply,db: Session = Depends(get_db)):
    if not db.query(recordModel.Prescription).filter(recordModel.Prescription.prescription_id == prescription_id).update({
                                                    'supply_id': request.supply_id ,
                                                    'quantity': request.quantity ,
                                                    'doc_id': request.doc_id ,
                                                    'prescription_notes': request.prescription_notes,
                                                    'date_prescribed' : request.date_prescribed
                                                    }):
        raise HTTPException(404, 'Prescription not found')
    db.commit()
    updated_prescription_s = db.query(recordModel.Prescription).filter(recordModel.Prescription.prescription_id == prescription_id).first()
    return updated_prescription_s

# <!-- 
# | =================================================================================
# |                               GET ALL PATIENT RECORD
# | =================================================================================
# -->

@router.get('/')
def get_all(db: Session = Depends(get_db)):
    record = db.query(recordModel.Record).options(joinedload(recordModel.Record.historyrecordFK),
                                        joinedload(recordModel.Record.problemrecordFK),
                                        joinedload(recordModel.Record.diagnosisrecordFK),
                                        joinedload(recordModel.Record.labresultrecordFK),
                                        joinedload(recordModel.Record.prescriptionrecordFK),
                                        joinedload(recordModel.Record.progressnoterecordFK)).all()
    return record


