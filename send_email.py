import os
from turtle import title
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi.staticfiles import StaticFiles 
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv
import pdfkit

wkhtml_path = pdfkit.configuration(wkhtmltopdf = "C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe")
load_dotenv('.env')
templates = Jinja2Templates(directory="templates")

class Envs:
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_FROM = os.getenv('MAIL_FROM')
    MAIL_PORT = int(os.getenv('MAIL_PORT'))
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_FROM_NAME = os.getenv('MAIL_FROM_NAME')

conf = ConnectionConfig(
    MAIL_USERNAME=Envs.MAIL_USERNAME,
    MAIL_PASSWORD=Envs.MAIL_PASSWORD,
    MAIL_FROM=Envs.MAIL_FROM,
    MAIL_PORT=Envs.MAIL_PORT,
    MAIL_SERVER=Envs.MAIL_SERVER,
    MAIL_FROM_NAME=Envs.MAIL_FROM_NAME,
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER='templates'
)

# async def send_email_async(subject: str, email_to: str):
#     message = MessageSchema(
#         subject=subject,
#         recipients=[email_to],
#         body= 'email.html',
#         subtype='html',
#     )
    
#     fm = FastMail(conf)
#     await fm.send_message(message, template_name='email.html')

def record_request_pdf(background_tasks: BackgroundTasks, request_id: str, patient_id:str, name: str):
    path = 'http://127.0.0.1:8000/recordRequest/emailRecord/'+request_id+'/'+patient_id
    pdfkit.from_url(path, name, configuration=wkhtml_path)

def send_email_background(background_tasks: BackgroundTasks, subject: str, email_to: str, request_id: str, patient_id: str, name:str, requester:str,):
    path = 'http://127.0.0.1:8000/recordRequest/emailRecord/'+request_id+'/'+patient_id
    pdfkit.from_url(path, name, configuration=wkhtml_path)
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        template_body= {'title': 'HoMIES Medical Record','name': requester},
        subtype='html',
        attachments=[name]
    )
    fm = FastMail(conf)
    background_tasks.add_task(
       fm.send_message, message, template_name='email.html')

def send_email_reject(background_tasks: BackgroundTasks, subject: str, email_to: str, message:str):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        template_body= {'message': message},
        subtype='html',
    )
    fm = FastMail(conf)
    background_tasks.add_task(
       fm.send_message, message, template_name='reject_email.html')

