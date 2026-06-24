from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from app.config.db import get_db
from app.utils.email_sender import send_email_via_brevo

router = APIRouter(tags=['Email'])


class EmailRequest(BaseModel):
    vendor_id: str = Field(..., min_length=24)
    from_name: str = Field(..., min_length=1)
    from_email: EmailStr
    subject: str = Field(..., min_length=3)
    message: str = Field(..., min_length=5)
    appointment_date: str = Field(..., min_length=1)
    appointment_time: str = Field(..., min_length=1)


@router.post('/send-email')
async def send_vendor_email(request: EmailRequest):
    if not ObjectId.is_valid(request.vendor_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid vendor ID.')

    db = get_db()
    vendor = await db['vendors'].find_one({'_id': ObjectId(request.vendor_id)})
    if not vendor or not vendor.get('email'):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Vendor email not available.')

    html_content = f'''
        <h2>New inquiry from Vizha user</h2>
        <p><strong>Name:</strong> {request.from_name}</p>
        <p><strong>Email:</strong> {request.from_email}</p>
        <p><strong>Appointment Date:</strong> {request.appointment_date}</p>
        <p><strong>Appointment Time:</strong> {request.appointment_time}</p>
        <p><strong>Message:</strong><br />{request.message}</p>
        <p>Please reply to <a href="mailto:{request.from_email}">{request.from_email}</a>.</p>
    '''
    text_content = (
        f'New inquiry from Vizha user\n'
        f'Name: {request.from_name}\n'
        f'Email: {request.from_email}\n'
        f'Appointment Date: {request.appointment_date}\n'
        f'Appointment Time: {request.appointment_time}\n'
        f'Message: {request.message}\n'
        f'Reply to: {request.from_email}'
    )

    result = await send_email_via_brevo(
        recipient_email=vendor['email'],
        recipient_name=vendor.get('shop_name', ''),
        reply_to_email=request.from_email,
        subject=request.subject,
        html_content=html_content,
        text_content=text_content
    )

    return {
        'message': 'Email sent successfully.',
        'brevo_response': result
    }
