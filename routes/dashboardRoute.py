import re
from typing import List
from fastapi import APIRouter,Depends,status,HTTPException,Request,BackgroundTasks,File,UploadFile
from fastapi.openapi.models import Reference
from models import recordModel,patientModel,doctorModel,requestModel,surgery
from schemas import recordSchema, userSchema, patientSchema
import database, oauth2
from sqlalchemy.orm import Session, joinedload
from datatables import DataTable
from sqlalchemy import or_
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from dateutil.relativedelta import *
import secrets
from datetime import date
from PIL import Image
templates = Jinja2Templates(directory="templates")
router = APIRouter(
    prefix="/dashboard",
    tags=['Dash/board']
)

get_db = database.get_db



# <!-- 
# | =================================================================================
# |                               GET UPCOMING CONSULTATION
# | =================================================================================
# -->
@router.get('/u/GetConsultation')
def get_consultation(db: Session = Depends(get_db)):
    progress_note = db.query(recordModel.ProgressNote).options(joinedload(recordModel.ProgressNote.docentryFK),joinedload(recordModel.ProgressNote.progressnoteFK).joinedload(recordModel.Record.patientrecordFK)).filter(date.today() <= recordModel.ProgressNote.next_appointment).all()
    
    return progress_note
# <!-- 
# | =================================================================================
# |                               GET TOTAL FOR DASHBOARD
# | =================================================================================
# -->
@router.get('/GetTotal')
def get_total(db: Session = Depends(get_db)):
    total_patient   = db.query(recordModel.Record).count()
    total_request   = db.query(requestModel.Request).count()
    total_discharge = db.query(patientModel.Discharge).count()
    total_call_logs = db.query(recordModel.CallLogDetail).count()
    total_pending   = db.query(requestModel.Request).filter(requestModel.Request.active_status == 'Pending').count()
    total_approved  = db.query(requestModel.Request).filter(requestModel.Request.active_status == 'Approved').count()
    rejected  = db.query(requestModel.Request).filter(requestModel.Request.active_status == 'Rejected').count()
    cancelled = db.query(requestModel.Request).filter(requestModel.Request.active_status == 'Cancelled').count()
    deleted   = db.query(requestModel.Request).filter(requestModel.Request.active_status == 'Deleted').count()
    total_rejected = rejected + cancelled + deleted

    progress_note = db.query(recordModel.ProgressNote).options(joinedload(recordModel.ProgressNote.docentryFK),joinedload(recordModel.ProgressNote.progressnoteFK).joinedload(recordModel.Record.patientrecordFK)).filter(date.today() <= recordModel.ProgressNote.next_appointment).all()
    
    
    total_diagnosis = db.query(recordModel.Diagnosis).count()
    total_allergy = db.query(recordModel.Allergy).count()
    total_laboratory = db.query(recordModel.LabResult).count()
    total_surgery = db.query(surgery.Surgery).count()
    total_note = db.query(recordModel.ProgressNote).count()
    return {'total_patient':total_patient,
            'total_request':total_request,
            'total_discharge':total_discharge,
            'total_call_logs':total_call_logs,
            'total_pending':total_pending,
            'total_approved':total_approved,
            'total_rejected':rejected,
            'total_cancelled':cancelled,
            'total_diagnosis':total_diagnosis,
            'total_allergy':total_allergy,
            'total_note':total_note,
            'total_surgery' : total_surgery,
            'total_laboratory':total_laboratory,
            'progress_note': progress_note
            }



# <!-- 
# | =================================================================================
# |                               GET TOTAL MEDICAL REQUEST 
# | =================================================================================
# -->

@router.get('/GetTotalRequest')
def get_total(db: Session = Depends(get_db)):
    total_request   = db.query(requestModel.Request).filter(requestModel.Request.created_at.between(str(date.today().year) + "-1-1", str(date.today().year) + "-12-31")).all()
    return {
            'total_request':total_request,
            }


# <!-- 
# | =================================================================================
# |                               GET TOTAL MEDICAL REQUEST STATUS
# | =================================================================================
# -->

@router.get('/GetTotalRequestStatus')
def get_total_status(db: Session = Depends(get_db)):
    # total_request_status   = db.query(requestModel.Request).filter(requestModel.Request.active_status.between(str(date.today().year) + "-1-1", str(date.today().year) + "-12-31")).all()
    total_approved   = db.query(requestModel.Request).filter(requestModel.Request.active_status == "Approved").count()
    total_pending    = db.query(requestModel.Request).filter(requestModel.Request.active_status == "Pending").count()
    total_rejected   = db.query(requestModel.Request).filter(requestModel.Request.active_status == "Rejected").count()
    total_cancelled  = db.query(requestModel.Request).filter(requestModel.Request.active_status == "Cancelled").count()
    return {
            'total_approved':total_approved,
            'total_pending':total_pending,
            'total_rejected':total_rejected,
            'total_cancelled':total_cancelled,
            }


# <!-- 
# | =================================================================================
# |                               GET TOTAL IMMUNIZATION(TYPE)
# | =================================================================================
# -->

@router.get('/GetTotalImmunization')
def get_total_immunization(db: Session = Depends(get_db)):
    total_live  = db.query(recordModel.Immunization).filter(recordModel.Immunization.type == "Live, attenuated").count()
    total_inactivated  = db.query(recordModel.Immunization).filter(recordModel.Immunization.type == "Inactivated/Killed").count()
    total_toxoid  = db.query(recordModel.Immunization).filter(recordModel.Immunization.type == "Toxoid (inactivated toxin)").count()
    total_subunit  = db.query(recordModel.Immunization).filter(recordModel.Immunization.type == "Subunit/conjugate").count()
    
    return {
            'total_live':total_live,
            'total_inactivated':total_inactivated,
            'total_toxoid':total_toxoid,
            'total_subunit':total_subunit,
            }

