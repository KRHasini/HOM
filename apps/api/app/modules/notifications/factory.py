from __future__ import annotations

from app.core.config import Settings
from app.modules.notifications.base import Mailer
from app.modules.notifications.console import ConsoleMailer
from app.modules.notifications.smtp import SmtpMailer


def build_mailer(settings: Settings) -> Mailer:
    if settings.mail_backend == "smtp":
        return SmtpMailer(settings)
    return ConsoleMailer()
