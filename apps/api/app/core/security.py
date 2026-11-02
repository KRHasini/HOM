"""Security primitives.

Phase 1 needs only privacy-preserving hashing, signed form-timing tokens and client
IP resolution. Phase 2 authentication (staff / instructor / parent roles) plugs in
here as FastAPI dependencies, e.g. ``require_role(Role.ADMIN)``, without touching
existing routers.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import time
from dataclasses import dataclass
from enum import StrEnum

from fastapi import Request

from app.core.config import Settings


class Role(StrEnum):
    """Reserved for Phase 2+ role-based access control."""

    ADMIN = "admin"
    STAFF = "staff"
    INSTRUCTOR = "instructor"
    STUDENT = "student"
    PARENT = "parent"


def hash_ip(ip: str | None, secret: str) -> str | None:
    """Keyed hash so raw IPs are never stored but abuse can still be correlated."""
    if not ip:
        return None
    return hmac.new(secret.encode(), ip.encode(), hashlib.sha256).hexdigest()


def client_ip(request: Request, settings: Settings) -> str | None:
    if settings.trust_proxy_headers:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip.strip()
    return request.client.host if request.client else None


# --- form timing tokens -----------------------------------------------------


@dataclass(frozen=True, slots=True)
class FormToken:
    token: str
    issued_at_ms: int


def _sign(payload: str, secret: str) -> str:
    digest = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(digest).decode().rstrip("=")


def issue_form_token(secret: str, *, now_ms: int | None = None) -> FormToken:
    issued = now_ms if now_ms is not None else int(time.time() * 1000)
    payload = str(issued)
    return FormToken(token=f"{payload}.{_sign(payload, secret)}", issued_at_ms=issued)


def form_token_age_seconds(token: str, secret: str, *, now_ms: int | None = None) -> float | None:
    """Return the token's age in seconds, or ``None`` if it is malformed or forged."""
    payload, sep, signature = token.partition(".")
    if not sep or not payload.isdigit():
        return None
    if not hmac.compare_digest(signature, _sign(payload, secret)):
        return None
    now = now_ms if now_ms is not None else int(time.time() * 1000)
    return (now - int(payload)) / 1000
