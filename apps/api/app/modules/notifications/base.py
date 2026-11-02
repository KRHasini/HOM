"""Provider-agnostic notification contracts.

Email is the first channel. SMS / WhatsApp providers (Phase 4) implement the same
shape: a small message dataclass plus an async ``send`` that raises
``NotificationError`` on failure.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol


class NotificationError(Exception):
    """Raised by adapters when a message could not be delivered."""


@dataclass(frozen=True, slots=True)
class EmailMessage:
    to: list[str]
    subject: str
    text: str
    html: str | None = None
    reply_to: str | None = None
    headers: dict[str, str] = field(default_factory=dict)


class Mailer(Protocol):
    async def send(self, message: EmailMessage) -> None: ...
