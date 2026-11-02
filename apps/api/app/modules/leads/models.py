from __future__ import annotations

import uuid
from enum import StrEnum

from sqlalchemy import (
    Boolean,
    Enum,
    ForeignKey,
    Index,
    SmallInteger,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import TimestampedModel


class EnquiryType(StrEnum):
    TRIAL = "trial"
    CONTACT = "contact"


class Audience(StrEnum):
    SELF = "self"
    CHILD = "child"


class LeadStatus(StrEnum):
    """Full lifecycle reserved for Phase 2 lead management; Phase 1 only writes NEW."""

    NEW = "NEW"
    CONTACTED = "CONTACTED"
    TRIAL_BOOKED = "TRIAL_BOOKED"
    TRIAL_ATTENDED = "TRIAL_ATTENDED"
    CONVERTED = "CONVERTED"
    LOST = "LOST"
    CANCELLED = "CANCELLED"


class LeadEventType(StrEnum):
    CREATED = "created"
    NOTIFIED = "notified"
    NOTIFY_FAILED = "notify_failed"


def _enum(enum_cls: type[StrEnum], name: str) -> Enum:
    # VARCHAR + CHECK constraint: easier to evolve than native Postgres enums.
    return Enum(
        enum_cls,
        name=name,
        native_enum=False,
        create_constraint=True,
        length=32,
        values_callable=lambda e: [m.value for m in e],
    )


class Lead(TimestampedModel):
    __tablename__ = "leads"
    __table_args__ = (
        Index("ix_leads_status_created_at", "status", "created_at"),
        Index("ix_leads_phone", "phone"),
    )

    name: Mapped[str] = mapped_column(String(80))
    phone: Mapped[str] = mapped_column(String(20))
    email: Mapped[str | None] = mapped_column(String(254))
    enquiry_type: Mapped[EnquiryType] = mapped_column(_enum(EnquiryType, "enquiry_type"))
    audience: Mapped[Audience | None] = mapped_column(_enum(Audience, "audience"))
    age: Mapped[int | None] = mapped_column(SmallInteger)
    class_slug: Mapped[str | None] = mapped_column(String(64))
    preferred_days: Mapped[list[str]] = mapped_column(ARRAY(String(16)), default=list)
    preferred_time: Mapped[str | None] = mapped_column(String(32))
    message: Mapped[str | None] = mapped_column(Text)
    status: Mapped[LeadStatus] = mapped_column(
        _enum(LeadStatus, "lead_status"), default=LeadStatus.NEW, server_default="NEW"
    )
    source: Mapped[str | None] = mapped_column(String(64))
    utm_source: Mapped[str | None] = mapped_column(String(128))
    utm_medium: Mapped[str | None] = mapped_column(String(128))
    utm_campaign: Mapped[str | None] = mapped_column(String(128))
    referrer: Mapped[str | None] = mapped_column(String(512))
    landing_page: Mapped[str | None] = mapped_column(String(512))
    consent: Mapped[bool] = mapped_column(Boolean, default=False)
    ip_hash: Mapped[str | None] = mapped_column(String(64))
    user_agent: Mapped[str | None] = mapped_column(String(512))
    idempotency_key: Mapped[str | None] = mapped_column(String(128), unique=True)

    events: Mapped[list[LeadEvent]] = relationship(
        back_populates="lead", cascade="all, delete-orphan", lazy="raise"
    )


class LeadEvent(TimestampedModel):
    __tablename__ = "lead_events"

    lead_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("leads.id", ondelete="CASCADE"), index=True
    )
    event: Mapped[LeadEventType] = mapped_column(_enum(LeadEventType, "lead_event_type"))
    detail: Mapped[dict[str, object] | None] = mapped_column(JSONB)

    lead: Mapped[Lead] = relationship(back_populates="events", lazy="raise")
