from __future__ import annotations

from email.message import EmailMessage as MimeMessage

import aiosmtplib

from app.core.config import Settings
from app.modules.notifications.base import EmailMessage, NotificationError


class SmtpMailer:
    """SMTP adapter. Works with any provider that exposes SMTP (Resend, SES, Zoho, Gmail)."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def _build(self, message: EmailMessage) -> MimeMessage:
        mime = MimeMessage()
        mime["From"] = self._settings.mail_from
        mime["To"] = ", ".join(message.to)
        mime["Subject"] = message.subject
        if message.reply_to:
            mime["Reply-To"] = message.reply_to
        for key, value in message.headers.items():
            mime[key] = value
        mime.set_content(message.text)
        if message.html:
            mime.add_alternative(message.html, subtype="html")
        return mime

    async def send(self, message: EmailMessage) -> None:
        s = self._settings
        try:
            await aiosmtplib.send(
                self._build(message),
                hostname=s.smtp_host,
                port=s.smtp_port,
                username=s.smtp_username or None,
                password=s.smtp_password.get_secret_value() or None,
                start_tls=s.smtp_starttls and not s.smtp_ssl,
                use_tls=s.smtp_ssl,
                timeout=s.smtp_timeout_seconds,
            )
        except (aiosmtplib.SMTPException, OSError, TimeoutError) as exc:
            raise NotificationError(f"SMTP delivery failed: {type(exc).__name__}") from exc
