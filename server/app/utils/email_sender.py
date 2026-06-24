import os
import httpx
from fastapi import HTTPException, status


def _clean_env_value(value: str) -> str:
    return value.strip().strip('"').strip(',').strip()


async def send_email_via_brevo(
    recipient_email: str,
    recipient_name: str,
    reply_to_email: str,
    subject: str,
    html_content: str,
    text_content: str
) -> dict:
    api_key = os.getenv('BREVO_API_KEY')
    if api_key:
        api_key = _clean_env_value(api_key)

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Brevo API key is not configured. Set a valid BREVO_API_KEY in .env, not the SMTP password.'
        )

    sender_email = _clean_env_value(os.getenv('MAIL_FROM', ''))
    sender_name = _clean_env_value(os.getenv('MAIL_FROM_NAME') or os.getenv('MAIL_USERNAME', 'Vizha')) or 'Vizha'
    if not sender_email:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Mail sender email is not configured.'
        )

    payload = {
        'sender': {'name': sender_name, 'email': sender_email},
        'to': [{'email': recipient_email, 'name': recipient_name or recipient_email}],
        'replyTo': {'email': reply_to_email},
        'subject': subject,
        'htmlContent': html_content,
        'textContent': text_content
    }

    headers = {
        'api-key': api_key,
        'Content-Type': 'application/json'
    }

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post('https://api.brevo.com/v3/smtp/email', json=payload, headers=headers)

    if response.status_code == 401:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='Brevo email service error: 401 Unauthorized. Check that BREVO_API_KEY is a valid Brevo API key and not the SMTP password.'
        )

    if response.status_code >= 300:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f'Brevo email service error: {response.status_code} {response.text}'
        )

    return response.json()
