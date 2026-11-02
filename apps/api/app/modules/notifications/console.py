from __future__ import annotations

from app.core.logging import get_logger
from app.modules.notifications.base import EmailMessage

logger = get_logger(__name__)


class ConsoleMailer:
    """Development adapter: logs the email instead of sending it.

    Bodies are only emitted at DEBUG so personal data never reaches info logs.
    """

    async def send(self, message: EmailMessage) -> None:
        logger.info("email.console", to_count=len(message.to), subject=message.subject)
        logger.debug("email.console.body", text=message.text)
