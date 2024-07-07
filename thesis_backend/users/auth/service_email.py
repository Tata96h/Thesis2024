# email_sender.py

from email.mime.image import MIMEImage
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = int(os.getenv('SMTP_PORT'))
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
FROM_EMAIL = os.getenv('FROM_EMAIL')
APP_NAME = os.getenv('APP_NAME')
LOGO_PATH = 'sm.png'


async def send_email(to_email, subject, html_body, app_name):
    msg = MIMEMultipart('alternative')
    msg['From'] = f"{app_name} <{FROM_EMAIL}>"
    msg['To'] = to_email
    msg['Subject'] = f"[{app_name}]" 

    # Create HTML MIMEText object
    html_part = MIMEText(html_body, 'html')

    # Attach the HTML part to MIMEMultipart object
    msg.attach(html_part)

    try:
        with open(LOGO_PATH, 'rb') as img_file:
            img = MIMEImage(img_file.read())
            img.add_header('Content-ID', '<logo>')
            msg.attach(img)
    except Exception as e:
        print(f"Erreur lors de l'ajout du logo : {str(e)}")

        
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")
