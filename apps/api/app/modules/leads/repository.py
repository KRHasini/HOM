"""Persistence for leads and their audit events. The only layer that touches SQL."""

from __future__ import annotations

import uuid
from collections.abc import Sequence
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.leads.models import Lead, LeadEvent, LeadEventType, LeadStatus


@dataclass(frozen=True, slots=True)
class LeadFilters:
    """Filters reserved for the Phase 2 lead inbox."""

    status: LeadStatus | None = None
    class_slug: str | None = None
    created_from: datetime | None = None
    created_to: datetime | None = None


class LeadRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get(self, lead_id: uuid.UUID) -> Lead | None:
        stmt = select(Lead).where(Lead.id == lead_id, Lead.deleted_at.is_(None))
        result: Lead | None = await self.session.scalar(stmt)
        return result

    async def get_by_idempotency_key(self, key: str) -> Lead | None:
        result: Lead | None = await self.session.scalar(
            select(Lead).where(Lead.idempotency_key == key)
        )
        return result

    async def add(self, lead: Lead) -> Lead:
        self.session.add(lead)
        await self.session.flush()
        return lead

    async def add_event(
        self, lead_id: uuid.UUID, event: LeadEventType, detail: dict[str, Any] | None = None
    ) -> LeadEvent:
        record = LeadEvent(lead_id=lead_id, event=event, detail=detail)
        self.session.add(record)
        await self.session.flush()
        return record

    async def list_events(self, lead_id: uuid.UUID) -> Sequence[LeadEvent]:
        result = await self.session.scalars(
            select(LeadEvent).where(LeadEvent.lead_id == lead_id).order_by(LeadEvent.created_at)
        )
        return result.all()

    async def search(
        self, filters: LeadFilters, *, offset: int = 0, limit: int = 50
    ) -> tuple[Sequence[Lead], int]:
        stmt = select(Lead).where(Lead.deleted_at.is_(None))
        if filters.status:
            stmt = stmt.where(Lead.status == filters.status)
        if filters.class_slug:
            stmt = stmt.where(Lead.class_slug == filters.class_slug)
        if filters.created_from:
            stmt = stmt.where(Lead.created_at >= filters.created_from)
        if filters.created_to:
            stmt = stmt.where(Lead.created_at < filters.created_to)
        total = await self.session.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        rows = await self.session.scalars(
            stmt.order_by(Lead.created_at.desc()).offset(offset).limit(limit)
        )
        return rows.all(), total

    async def update_status(self, lead: Lead, status: LeadStatus) -> Lead:
        lead.status = status
        await self.session.flush()
        return lead

    async def find_by_contact(self, phone: str | None, email: str | None) -> Sequence[Lead]:
        conditions = []
        if phone:
            conditions.append(Lead.phone == phone)
        if email:
            conditions.append(func.lower(Lead.email) == email.lower())
        if not conditions:
            return []
        rows = await self.session.scalars(select(Lead).where(or_(*conditions)))
        return rows.all()
