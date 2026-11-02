"""Lead request/response contracts. Rules mirror ``apps/web/src/lib/validation/lead.ts``."""

from __future__ import annotations

import re
import uuid
from typing import Annotated, Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    StringConstraints,
    field_validator,
)

from app.modules.leads.models import Audience, EnquiryType
from app.modules.leads.phone import normalize_phone

Weekday = Literal["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
TimeWindow = Literal["morning", "afternoon", "evening", "weekend", "flexible"]

_SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
IDEMPOTENCY_KEY = re.compile(r"^[A-Za-z0-9_-]{8,128}$")

OptionalShortText = Annotated[str | None, StringConstraints(strip_whitespace=True, max_length=128)]
OptionalUrlText = Annotated[str | None, StringConstraints(strip_whitespace=True, max_length=512)]


class LeadCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    enquiry_type: EnquiryType
    name: Annotated[str, StringConstraints(min_length=2, max_length=80)]
    phone: Annotated[str, StringConstraints(min_length=6, max_length=24)]
    email: EmailStr | None = None
    audience: Audience | None = None
    age: Annotated[int | None, Field(ge=2, le=99)] = None
    class_slug: Annotated[str | None, StringConstraints(max_length=64)] = None
    preferred_days: Annotated[list[Weekday], Field(max_length=7)] = Field(default_factory=list)
    preferred_time: TimeWindow | None = None
    message: Annotated[str | None, StringConstraints(max_length=1000)] = None
    consent: bool

    # attribution — captured silently by the web client
    source: OptionalShortText = None
    utm_source: OptionalShortText = None
    utm_medium: OptionalShortText = None
    utm_campaign: OptionalShortText = None
    referrer: OptionalUrlText = None
    landing_page: OptionalUrlText = None

    # anti-spam
    website: Annotated[str, Field(max_length=200, description="Honeypot. Must be empty.")] = ""
    form_token: Annotated[str, Field(max_length=200, description="Signed render-time token.")]
    turnstile_token: Annotated[str | None, Field(max_length=4096)] = None

    @field_validator("phone")
    @classmethod
    def _normalize_phone(cls, value: str) -> str:
        return normalize_phone(value)

    @field_validator("consent")
    @classmethod
    def _require_consent(cls, value: bool) -> bool:
        if value is not True:
            raise ValueError("Please accept the privacy note to continue.")
        return value

    @field_validator("class_slug")
    @classmethod
    def _valid_slug(cls, value: str | None) -> str | None:
        if value and not _SLUG.match(value):
            raise ValueError("Unknown class.")
        return value or None

    @field_validator("email", "message", mode="before")
    @classmethod
    def _blank_to_none(cls, value: object) -> object:
        if isinstance(value, str) and not value.strip():
            return None
        return value

    @field_validator("preferred_days")
    @classmethod
    def _dedupe_days(cls, value: list[Weekday]) -> list[Weekday]:
        return list(dict.fromkeys(value))


class LeadCreated(BaseModel):
    id: uuid.UUID
    message: str


class FormTokenResponse(BaseModel):
    token: str
    issued_at: int = Field(description="Unix epoch milliseconds")
    min_seconds: float
