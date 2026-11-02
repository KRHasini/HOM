"""Lead capture business logic: spam defenses, idempotency, persistence, notification."""

from __future__ import annotations

import uuid
from dataclasses import dataclass

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.config import Settings
from app.core.errors import RateLimitedError
from app.core.logging import get_logger, mask_email, mask_phone
from app.core.rate_limit import RateLimiter
from app.core.security import hash_ip
from app.modules.leads.antispam import check_form_timing, check_honeypot, verify_turnstile
from app.modules.leads.models import Lead, LeadEventType, LeadStatus
from app.modules.leads.repository import LeadRepository
from app.modules.leads.schemas import LeadCreate
from app.modules.notifications.base import Mailer, NotificationError
from app.modules.notifications.templates import studio_notification, visitor_confirmation

logger = get_logger(__name__)


@dataclass(frozen=True, slots=True)
class SubmissionContext:
    ip: str | None
    user_agent: str | None
    idempotency_key: str | None


@dataclass(frozen=True, slots=True)
class LeadResult:
    lead: Lead
    created: bool


class LeadService:
    def __init__(
        self,
        session: AsyncSession,
        settings: Settings,
        rate_limiter: RateLimiter,
    ) -> None:
        self.session = session
        self.repo = LeadRepository(session)
        self.settings = settings
        self.rate_limiter = rate_limiter

    async def create(self, payload: LeadCreate, ctx: SubmissionContext) -> LeadResult:
        if ctx.idempotency_key:
            existing = await self.repo.get_by_idempotency_key(ctx.idempotency_key)
            if existing:
                logger.info("lead.idempotent_replay", lead_id=str(existing.id))
                return LeadResult(existing, created=False)

        ip_hash = hash_ip(ctx.ip, self.settings.ip_hash_secret.get_secret_value())
        allowed, retry_after = await self.rate_limiter.hit(f"leads:{ip_hash or 'unknown'}")
        if not allowed:
            logger.info("lead.rejected", reason="rate_limited")
            raise RateLimitedError(headers={"Retry-After": str(retry_after)})

        check_honeypot(payload.website)
        check_form_timing(payload.form_token, self.settings)
        await verify_turnstile(payload.turnstile_token, ctx.ip, self.settings)

        lead = Lead(
            name=payload.name,
            phone=payload.phone,
            email=str(payload.email) if payload.email else None,
            enquiry_type=payload.enquiry_type,
            audience=payload.audience,
            age=payload.age,
            class_slug=payload.class_slug,
            preferred_days=list(payload.preferred_days),
            preferred_time=payload.preferred_time,
            message=payload.message,
            status=LeadStatus.NEW,
            source=payload.source,
            utm_source=payload.utm_source,
            utm_medium=payload.utm_medium,
            utm_campaign=payload.utm_campaign,
            referrer=payload.referrer,
            landing_page=payload.landing_page,
            consent=payload.consent,
            ip_hash=ip_hash,
            user_agent=(ctx.user_agent or "")[:512] or None,
            idempotency_key=ctx.idempotency_key,
        )

        try:
            await self.repo.add(lead)
            await self.repo.add_event(
                lead.id, LeadEventType.CREATED, {"enquiry_type": lead.enquiry_type.value}
            )
            await self.session.commit()
        except IntegrityError:
            # Two concurrent requests with the same idempotency key: return the winner.
            await self.session.rollback()
            if ctx.idempotency_key:
                existing = await self.repo.get_by_idempotency_key(ctx.idempotency_key)
                if existing:
                    return LeadResult(existing, created=False)
            raise

        logger.info(
            "lead.created",
            lead_id=str(lead.id),
            enquiry_type=lead.enquiry_type.value,
            class_slug=lead.class_slug,
            phone=mask_phone(lead.phone),
            email=mask_email(lead.email),
            utm_source=lead.utm_source,
        )
        return LeadResult(lead, created=True)


async def notify_lead(
    lead_id: uuid.UUID,
    session_factory: async_sessionmaker[AsyncSession],
    mailer: Mailer,
    settings: Settings,
) -> None:
    """Send notifications for a stored lead. Never raises: failures are logged and audited."""
    async with session_factory() as session:
        repo = LeadRepository(session)
        lead = await repo.get(lead_id)
        if lead is None:
            return
        try:
            await mailer.send(studio_notification(lead, settings))
        except Exception as exc:  # a failed email must never fail the lead
            level = "warning" if isinstance(exc, NotificationError) else "error"
            getattr(logger, level)(
                "lead.notify_failed", lead_id=str(lead_id), error=type(exc).__name__
            )
            await repo.add_event(lead_id, LeadEventType.NOTIFY_FAILED, {"error": str(exc)[:500]})
        else:
            logger.info("lead.notified", lead_id=str(lead_id))
            await repo.add_event(lead_id, LeadEventType.NOTIFIED, {"channel": "email"})

        if settings.send_visitor_confirmation:
            confirmation = visitor_confirmation(lead, settings)
            if confirmation:
                try:
                    await mailer.send(confirmation)
                except Exception as exc:
                    logger.warning(
                        "lead.confirmation_failed", lead_id=str(lead_id), error=type(exc).__name__
                    )
        await session.commit()
