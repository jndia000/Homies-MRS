from typing import List
from fastapi import APIRouter,Depends,status,HTTPException,Request,BackgroundTasks
from fastapi.openapi.models import Reference
from sqlalchemy.sql.expression import null
from sqlalchemy.sql.operators import is_
from models import recordModel,patientModel,doctorModel,userModel,surgery,presModel
from schemas import recordSchema, userSchema, patientSchema
import database, oauth2
from sqlalchemy.orm import Session, joinedload
from datatables import DataTable
from sqlalchemy import or_
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
templates = Jinja2Templates(directory="templates")
router = APIRouter(
    prefix="/table",
    tags=['Datatables']
)

get_db = database.get_db

# <!-- 
# | =================================================================================
# |                               USERS DATATABLE
# | =================================================================================
# -->
@router.get('/users')
def get_all_user(request: Request, db: Session = Depends(get_db)):
    try:
        
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    userModel.User.email.like('%' + user_input + '%'),
                    userModel.User.active_status.like('%' + user_input + '%'),
                    userModel.UserType.title.like('%' + user_input + '%'),
                    # userModel.UserProfile.first_name.like('%' + user_input + '%'),
                    # userModel.UserProfile.last_name.like('%' + user_input + '%')
                )
            )

        
        user_table = DataTable(dict(request.query_params), userModel.User, db.query(userModel.User).options(joinedload(userModel.User.user_typesFK)).options(joinedload(userModel.User.users_profilesFK)), [
            ('title', 'user_typesFK.title'),
            # ('last_name', 'users_profilesFK.last_name'),
            ('email'),
            'active_status',
            'user_id',
            # ('user_profile_id', 'users_profilesFK.user_profile_id'),

        ])

        user_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return user_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               PATIENT RECORD DATATABLE
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

        table = DataTable(dict(request.query_params), recordModel.Record, db.query(recordModel.Record).options(joinedload(recordModel.Record.patientrecordFK)), [
            ('patient_type', 'patientrecordFK.patient_type'),
            ('first_name', 'patientrecordFK.first_name' ),
            ('middle_name', 'patientrecordFK.middle_name' ),
            ('last_name', 'patientrecordFK.last_name'),
            ('sex', 'patientrecordFK.sex'),
            ('birthday', 'patientrecordFK.birthday'),
            ('blood_type', 'patientrecordFK.blood_type'),
            'patient_record_id'
        ])

        table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return table.json()
    except Exception as e:
        print(e)


# <!-- 
# | =================================================================================
# |                               PATIENT CALL LOG DATATABLE
# | =================================================================================
# -->
@router.get('/allLogs/{patient_call_log_id}')
def get_all_call_log(patient_call_log_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    recordModel.CallLogDetail.call_log_date.like('%' + user_input + '%'),
                    recordModel.CallLogDetail.contact_first_name.like('%' + user_input + '%'),
                    recordModel.CallLogDetail.contact_last_name.like('%' + user_input + '%'),
                    recordModel.CallLogDetail.contact_phone.like('%' + user_input + '%'),
                    recordModel.CallLogDetail.call_details.like('%' + user_input + '%'),
                    recordModel.CallLogDetail.follow_up_date.like('%' + user_input + '%')
                )
            )

        log_table = DataTable(dict(request.query_params), recordModel.CallLogDetail, db.query(recordModel.CallLogDetail).
                                                        filter(recordModel.CallLogDetail.patient_call_log_id == patient_call_log_id), [
            ('call_log_date'),
            ('contact_first_name'),
            ('contact_last_name'),
            ('contact_phone'),
            ('call_details'),
            ('follow_up_date'),
            ('call_log_detail_id')

        ])

        log_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return log_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               MEDICATION DATATABLE
# | =================================================================================
# -->
@router.get('/medications/{patient_record_id}')
def get_all_medications(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    recordModel.Medication.drug_name.like('%' + user_input + '%'),
                    recordModel.Medication.quantity.like('%' + user_input + '%'),
                    recordModel.Medication.dosage.like('%' + user_input + '%')
                    # recordModel.ProgressNote.physical_examination.like('%' + user_input + '%'),
                    # recordModel.ProgressNote.next_appointment.like('%' + user_input + '%')
                )
            )

        medications_table = DataTable(dict(request.query_params), recordModel.Medication, 
                                db.query(recordModel.Medication).
                                filter((recordModel.Medication.patient_record_id == patient_record_id)), [
            'drug_name',
            'dosage',
            'frequency',
            'quantity',
            'start_date',
            'end_date',
            'medication_status',
            'medication_id'
        ])

        medications_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return medications_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               ALLERGY  DATATABLE
# | =================================================================================
# -->
@router.get('/allergy/{patient_record_id}')
def get_all_allergy(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    recordModel.Allergy.allergen.like('%' + user_input + '%'),
                    recordModel.Allergy.severity.like('%' + user_input + '%'),
                    recordModel.Allergy.comment.like('%' + user_input + '%')
                    # recordModel.ProgressNote.physical_examination.like('%' + user_input + '%'),
                    # recordModel.ProgressNote.next_appointment.like('%' + user_input + '%')
                )
            )

        allergy_table = DataTable(dict(request.query_params), recordModel.Allergy, 
                                db.query(recordModel.Allergy).
                                filter((recordModel.Allergy.patient_record_id == patient_record_id)), [
            'allergen',
            'reaction',
            'severity',
            'comment',
            'allergy_id'
        ])

        allergy_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return allergy_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               IMMUNIZATION DATATABLE
# | =================================================================================
# -->
@router.get('/immunization/{patient_record_id}')
def get_all_allergy(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    recordModel.Immunization.allergen.like('%' + user_input + '%'),
                    recordModel.Immunization.severity.like('%' + user_input + '%'),
                    recordModel.Immunization.comment.like('%' + user_input + '%')
                    # recordModel.ProgressNote.physical_examination.like('%' + user_input + '%'),
                    # recordModel.ProgressNote.next_appointment.like('%' + user_input + '%')
                )
            )

        immunization_table = DataTable(dict(request.query_params), recordModel.Immunization, 
                                db.query(recordModel.Immunization).
                                filter((recordModel.Immunization.patient_record_id == patient_record_id)), [
            'vaccine',
            'type',
            'date_given',
            'administered_by',
            'immunization_id'
        ])

        immunization_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return immunization_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               ATTACHMENT DATATABLE
# | =================================================================================
# -->
@router.get('/attachment/{patient_record_id}')
def get_all_allergy(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    recordModel.Attachment.attachment.like('%' + user_input + '%'),
                    recordModel.Attachment.type.like('%' + user_input + '%'),
                    # recordModel.ProgressNote.physical_examination.like('%' + user_input + '%'),
                    # recordModel.ProgressNote.next_appointment.like('%' + user_input + '%')
                )
            )

        attachments_table = DataTable(dict(request.query_params), recordModel.Attachment, 
                                db.query(recordModel.Attachment).
                                filter((recordModel.Attachment.patient_record_id == patient_record_id)), [
            'attachment',
            'type',
            'attachment_id'
        ])

        attachments_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return attachments_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               PROBLEM LIST DATATABLE
# | =================================================================================
# -->
@router.get('/problem_list/{patient_record_id}')
def get_all(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    recordModel.Problem.active_status.like('%' + user_input + '%'),
                    recordModel.Problem.problem_name.like('%' + user_input + '%'),
                    recordModel.Problem.problem_note.like('%' + user_input + '%'),
                    recordModel.Problem.date_occured.like('%' + user_input + '%'),
                    recordModel.Problem.date_resolved.like('%' + user_input + '%')
                )
            )

        problem_table = DataTable(dict(request.query_params), recordModel.Problem, db.query(recordModel.Problem).filter(recordModel.Problem.patient_record_id == patient_record_id), [
            'problem_name',
            'problem_note',
            'active_status',
            'problem_id',
            'date_occured',
            'date_resolved'
        ])

        problem_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return problem_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               DIAGNOSIS LIST DATATABLE
# | =================================================================================
# -->
@router.get('/diagnosis_list/{patient_record_id}/{doc_id}')
def get_all_diagnosis(patient_record_id: str, doc_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    recordModel.Diagnosis.diagnosis.like('%' + user_input + '%'),
                    recordModel.Diagnosis.description.like('%' + user_input + '%')
                    # recordModel.Diagnosis.problem_note.like('%' + user_input + '%'),
                )
            )

        diagnosis_table = DataTable(dict(request.query_params), recordModel.Diagnosis, db.query(recordModel.Diagnosis).
                                                            options(joinedload(recordModel.Diagnosis.docdiagnosisFK)).filter(
                                                                                                                        (recordModel.Diagnosis.patient_record_id == patient_record_id)), [
            'diagnosis',
            'description',
            ('first_name','docdiagnosisFK.first_name'),
            ('middle_name','docdiagnosisFK.middle_name'),
            ('last_name','docdiagnosisFK.last_name'),
            'diagnosis_id'
            
        ])

        diagnosis_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return diagnosis_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               LABORATORY LIST DATATABLE
# | =================================================================================
# -->
@router.get('/laboratory_list/{patient_record_id}')
def get_all_laboratory(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    recordModel.LabResult.result.like('%' + user_input + '%'),
                    recordModel.LabResult.detailed_result.like('%' + user_input + '%'),
                    recordModel.LabResult.unit.like('%' + user_input + '%'),
                    recordModel.LabResult.specimen.like('%' + user_input + '%'),
                    recordModel.LabResult.status.like('%' + user_input + '%'),
                    recordModel.LabResult.reference.like('%' + user_input + '%')
                )
            )

        laboratory_table = DataTable(dict(request.query_params), recordModel.LabResult, db.query(recordModel.LabResult).filter(recordModel.LabResult.patient_record_id == patient_record_id), [
            'result',
            'detailed_result',
            'specimen',
            'unit',
            'reference',
            'status',
            'lab_result_id'
        ])

        laboratory_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return laboratory_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               Surgery LIST DATATABLE
# | =================================================================================
# -->
@router.get('/surgery_list/{patient_record_id}')
def get_all_surgery(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    surgery.SurgeryType.name.like('%' + user_input + '%'),
                    surgery.Surgery.start_time.like('%' + user_input + '%'),
                    surgery.Surgery.end_time.like('%' + user_input + '%'),
                    surgery.Surgery.description.like('%' + user_input + '%'),
                    surgery.Surgery.status.like('%' + user_input + '%'),
                )
            )

        surgery_table = DataTable(dict(request.query_params), surgery.Surgery, db.query(surgery.Surgery)
                                                            .options(joinedload(surgery.Surgery.surgery_type)).filter(surgery.Surgery.patient_record_id == patient_record_id), [
            ('name','surgery_type.name'),
            'description',
            'status',
            'id',
        ])

        surgery_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return surgery_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               PROGRESS NOTES DATATABLE
# | =================================================================================
# -->
@router.get('/note_list/{patient_record_id}/{doc_id}')
def get_all_note(patient_record_id: str, doc_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    recordModel.ProgressNote.reason_for_consultation.like('%' + user_input + '%'),
                    recordModel.ProgressNote.physical_examination.like('%' + user_input + '%'),
                    recordModel.ProgressNote.impression.like('%' + user_input + '%'),
                    recordModel.ProgressNote.recommendation.like('%' + user_input + '%'),
                    recordModel.ProgressNote.next_appointment.like('%' + user_input + '%'),
                    recordModel.ProgressNote.consultation_date.like('%' + user_input + '%')
                )
            )

        note_table = DataTable(dict(request.query_params), recordModel.ProgressNote, db.query(recordModel.ProgressNote).filter(
                                                                                                                            (recordModel.ProgressNote.patient_record_id == patient_record_id)), [
            'reason_for_consultation',
            'consultation_date',
            'physical_examination',
            'impression',
            'recommendation',
            'next_appointment',
            'progress_note_id'
        ])

        note_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return note_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               PRESCRIPTION[DRUG] DATATABLE
# | =================================================================================
# -->
@router.get('/d_prescription_list/{patient_record_id}')
def get_all_prescription_d(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    presModel.Medicine.med_product_name.like('%' + user_input + '%'),
                    recordModel.Prescription.dosage.like('%' + user_input + '%'),
                    recordModel.Prescription.frequency.like('%' + user_input + '%'),
                    recordModel.Prescription.quantity.like('%' + user_input + '%'),
                    recordModel.Prescription.route.like('%' + user_input + '%'),
                    recordModel.Prescription.prescription_notes.like('%' + user_input + '%')
                )
            )

        d_prescription_table = DataTable(dict(request.query_params), recordModel.Prescription, 
                                db.query(recordModel.Prescription).
                                options(joinedload(recordModel.Prescription.medicineFK)).
                                filter((recordModel.Prescription.patient_record_id == patient_record_id), (recordModel.Prescription.medication_type == "drug")), [
            ('med_product_name','medicineFK.med_product_name'),
            # 'med_id',
            'dosage',
            'frequency',
            'quantity',
            'route',
            'prescription_notes',
            # 'date_prescribed',
            'prescription_id'
        ])

        d_prescription_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return d_prescription_table.json()
    except Exception as e:
        print(e)
# <!-- 
# | =================================================================================
# |                               PRESCRIPTION[SUPPLY] DATATABLE
# | =================================================================================
# -->
@router.get('/s_prescription_list/{patient_record_id}')
def get_all_prescription_s(patient_record_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    presModel.MedicalSupplies.ms_product_name.like('%' + user_input + '%'),
                    recordModel.Prescription.quantity.like('%' + user_input + '%'),
                    recordModel.Prescription.prescription_notes.like('%' + user_input + '%')
                    # recordModel.ProgressNote.physical_examination.like('%' + user_input + '%'),
                    # recordModel.ProgressNote.next_appointment.like('%' + user_input + '%')
                )
            )

        s_prescription_table = DataTable(dict(request.query_params), recordModel.Prescription, 
                                db.query(recordModel.Prescription).
                                options(joinedload(recordModel.Prescription.supplyFK)).
                                filter((recordModel.Prescription.patient_record_id == patient_record_id), (recordModel.Prescription.medication_type == "supply")), [
            ('ms_product_name','supplyFK.ms_product_name'),
            'quantity',
            # 'supply_id',
            'prescription_notes',
            'prescription_id'
        ])

        s_prescription_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return s_prescription_table.json()
    except Exception as e:
        print(e)

# <!-- 
# | =================================================================================
# |                               DISCHARGE DATATABLE
# | =================================================================================
# -->
@router.get('/discharge_list/{patient_id}')
def get_all_discharge(patient_id: str,request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    patientModel.Discharge.reason_of_admittance.like('%' + user_input + '%'),
                    patientModel.Discharge.diagnosis_at_admittance.like('%' + user_input + '%'),
                    patientModel.Discharge.treatment_summary.like('%' + user_input + '%'),
                    patientModel.Discharge.ending_date.like('%' + user_input + '%'),
                    patientModel.Discharge.active_status.like('%' + user_input + '%')
                )
            )

        discharge_table = DataTable(dict(request.query_params), patientModel.Discharge, db.query(patientModel.Discharge).filter(patientModel.Discharge.patient_id == patient_id), [
            'reason_of_admittance',
            'diagnosis_at_admittance',
            'treatment_summary',
            'ending_date',
            'active_status',
            'discharge_id'
        ])

        discharge_table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return discharge_table.json()
    except Exception as e:
        print(e)
