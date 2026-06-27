import os
import ssl

import certifi
import httpx
from fastapi import HTTPException, status


def _clean_env_value(value: str | None) -> str:
    if not value:
        return ''
    return value.strip().strip('"').strip(',').strip()


def _ssl_contexts() -> list[ssl.SSLContext]:
    return [
        ssl.create_default_context(),
        ssl.create_default_context(cafile=certifi.where()),
    ]


async def _post_to_resend(payload: dict, headers: dict) -> httpx.Response:
    last_error: Exception | None = None

    for ssl_context in _ssl_contexts():
        try:
            async with httpx.AsyncClient(timeout=15, verify=ssl_context) as client:
                return await client.post(
                    'https://api.resend.com/emails',
                    json=payload,
                    headers=headers,
                )
        except httpx.ConnectError as exc:
            last_error = exc

    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail=f'Unable to reach Resend: {last_error}'
    ) from last_error


async def send_email(
    recipient_email: str,
    recipient_name: str,
    reply_to_email: str,
    subject: str,
    html_content: str,
    text_content: str
) -> dict:
    api_key = _clean_env_value(os.getenv('RESEND_API_KEY'))
    sender_email = _clean_env_value(os.getenv('MAIL_FROM'))
    sender_name = _clean_env_value(os.getenv('MAIL_FROM_NAME') or 'Vizha') or 'Vizha'

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='RESEND_API_KEY is not configured in server/.env'
        )

    if not sender_email:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='MAIL_FROM is not configured in server/.env'
        )

    payload = {
        'from': f'{sender_name} <{sender_email}>',
        'to': [recipient_email],
        'reply_to': reply_to_email,
        'subject': subject,
        'html': html_content,
        'text': text_content,
    }

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }

    response = await _post_to_resend(payload, headers)

    if response.status_code == 401:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                'Resend rejected the API key (401). '
                'Get a key from resend.com → API Keys (starts with re_) and set RESEND_API_KEY in server/.env.'
            )
        )

    if response.status_code >= 300:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f'Resend error: {response.status_code} {response.text}'
        )

    result = response.json()
    return {
        'provider': 'resend',
        'id': result.get('id'),
        'to': recipient_email,
    }
