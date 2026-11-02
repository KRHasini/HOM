"""Spam defenses for public write endpoints: honeypot, timing token, Turnstile."""

from __future__ import annotations

import httpx

from app.core.config import Settings
from app.core.errors import SpamRejectedError
from app.core.logging import get_logger
from app.core.security import form_token_age_seconds

logger = get_logger(__name__)

TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"


def check_honeypot(value: str) -> None:
    if value.strip():
        logger.info("lead.rejected", reason="honeypot")
        raise SpamRejectedError()


def check_form_timing(token: str, settings: Settings, *, now_ms: int | None = None) -> None:
    age = form_token_age_seconds(
        token, settings.form_token_secret.get_secret_value(), now_ms=now_ms
    )
    if age is None:
        logger.info("lead.rejected", reason="invalid_form_token")
        raise SpamRejectedError()
    if age < settings.form_min_seconds:
        logger.info("lead.rejected", reason="too_fast", age_seconds=round(age, 2))
        raise SpamRejectedError()
    if age > settings.form_token_max_age_seconds:
        logger.info("lead.rejected", reason="form_token_expired")
        raise SpamRejectedError(
            "This form has expired. Please refresh the page and try again.",
            code="form_expired",
        )


async def verify_turnstile(token: str | None, ip: str | None, settings: Settings) -> None:
    if not settings.turnstile_enabled:
        return
    if not token:
        raise SpamRejectedError()
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                TURNSTILE_VERIFY_URL,
                data={
                    "secret": settings.turnstile_secret_key.get_secret_value(),
                    "response": token,
                    **({"remoteip": ip} if ip else {}),
                },
            )
            ok = bool(response.json().get("success"))
    except (httpx.HTTPError, ValueError):
        logger.warning("turnstile.unavailable")
        ok = False
    if not ok:
        logger.info("lead.rejected", reason="turnstile")
        raise SpamRejectedError()
