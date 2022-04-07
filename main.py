from fastapi import FastAPI, Request, Depends, BackgroundTasks
from send_email import send_email_background
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import Optional
from pydantic import BaseModel
from models import doctorModel, patientModel, recordModel, userModel, requestModel, surgery, presModel
from routes import userRoute, patientRoute, doctorRoute, loginRoute, recordRoute, datatableRoute, requestRoute, dischargeRoute,patientrequestRoute, dashboardRoute
from database import engine
from fastapi.middleware.cors import CORSMiddleware
import database
from sqlalchemy.orm import Session
import database, oauth2



templates = Jinja2Templates(directory="templates")


app = FastAPI()
#mount static folder
app.mount('/static', StaticFiles(directory='static'), name='static')

# Create tables
doctorModel.Base.metadata.create_all(engine)
patientModel.Base.metadata.create_all(engine)
userModel.Base.metadata.create_all(engine)
recordModel.Base.metadata.create_all(engine)
requestModel.Base.metadata.create_all(engine)
surgery.Base.metadata.create_all(engine)
presModel.Base.metadata.create_all(engine)
# recordDetailModel.Base.metadata.create_all(engine)

get_db = database.get_db


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(loginRoute.router)
app.include_router(userRoute.router)
app.include_router(patientRoute.router)
app.include_router(doctorRoute.router)
app.include_router(recordRoute.router)
app.include_router(datatableRoute.router)
app.include_router(requestRoute.router)
app.include_router(dischargeRoute.router)
app.include_router(patientrequestRoute.router)
app.include_router(dashboardRoute.router)

# main - not logged in 
@app.get("/", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("landing/landing.html", {"request": request})

# admin login
@app.get("/login", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# patient login
@app.get("/patientLogin", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("patient/loginpatient.html", {"request": request})

@app.get("/home", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("patient/patientbase.html", {"request": request})

@app.get("/records", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("patient/patientrecord.html", {"request": request})

@app.get("/recordRequest", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("patient/patientrequest.html", {"request": request})



@app.get("/main", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("sidenav/dashboard/index.html", {"request": request})


@app.get("/admin", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("admin/systemadmin.html", {"request": request})

@app.get("/address", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("sidenav/dashboard/dashboard.html", {"request": request})


@app.get("/patientRecord", response_class=HTMLResponse)
async def read_item(request: Request, db: Session = Depends(get_db)):
    patient = db.query(patientModel.PatientRegistration.patient_id).all()
    return templates.TemplateResponse("sidenav/patientRecord/patientRecord.html", {"request": request,"patient": patient})

# @app.get("/medicalHistory", response_class=HTMLResponse)
# async def read_item(request: Request):
#     return templates.TemplateResponse("addMedicalHistory.html", {"request": request})



@app.get("/viewpatientrecord", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("sidenav/patientRecord/viewpatientrecord.html", {"request": request})


@app.get("/patientcalllogs", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("sidenav/patientRecord/patientcalllogs.html", {"request": request})

@app.get("/backup", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("sidenav/backup/backup.html", {"request": request})

@app.get("/requestForm", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("request/requestForm.html", {"request": request})

@app.get("/test", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("request/test.html", {"request": request})



@app.get("/users", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("admin/userManagement.html", {"request": request})

@app.get("/medicalRequest", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("sidenav/medicalRequest/medicalRequest.html", {"request": request})
@app.get("/requestRecord", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("request/request.html", {"request": request})

@app.get("/record", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("sidenav/patientRecord/recordForm.html", {"request": request})

@app.get("/testemail", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("record_email.html", {"request": request})


# @app.get('/send-email/asynchronous')
# async def send_email_asynchronous():
#     await send_email_async('Hello World', 'mojowjoww@gmail.com')
#     return 'Success'


@app.get('/send-email/backgroundtasks')
def send_email_backgroundtasks(background_tasks: BackgroundTasks):
    send_email_background(background_tasks, 'Medical Records', 'penlagonero@gmail.com')
    return 'Success'


# @app.get('/')
# def index():
#     return {'medical records here'}
    