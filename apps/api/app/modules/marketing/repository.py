from __future__ import annotations

from collections.abc import Sequence
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.pagination import PageParams
from app.modules.classes.models import DanceClass
from app.modules.marketing.models import Event, EventStatus, GalleryMedia, Testimonial
from app.modules.marketing.schemas import EventWhen


class MarketingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def _paginate(
        self, stmt: Select[*tuple[Any, ...]], page: PageParams
    ) -> tuple[Sequence[Any], int]:
        total = await self.session.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        rows = await self.session.execute(stmt.offset(page.offset).limit(page.page_size))
        return rows.all(), total

    async def testimonials(
        self, page: PageParams, *, class_slug: str | None, include_placeholders: bool
    ) -> tuple[Sequence[tuple[Testimonial, str | None]], int]:
        stmt = (
            select(Testimonial, DanceClass.slug)
            .outerjoin(DanceClass, DanceClass.id == Testimonial.class_id)
            .where(Testimonial.is_published, Testimonial.deleted_at.is_(None))
            .order_by(Testimonial.sort_order, Testimonial.created_at.desc())
        )
        if class_slug:
            stmt = stmt.where(DanceClass.slug == class_slug)
        if not include_placeholders:
            stmt = stmt.where(Testimonial.is_placeholder.is_(False))
        rows, total = await self._paginate(stmt, page)
        return [(row[0], row[1]) for row in rows], total

    async def gallery(
        self, page: PageParams, *, category: str | None, kind: str | None
    ) -> tuple[Sequence[GalleryMedia], int]:
        stmt = (
            select(GalleryMedia)
            .where(GalleryMedia.is_published, GalleryMedia.deleted_at.is_(None))
            .order_by(GalleryMedia.sort_order, GalleryMedia.created_at)
        )
        if category:
            stmt = stmt.where(GalleryMedia.category == category)
        if kind:
            stmt = stmt.where(GalleryMedia.kind == kind)
        rows, total = await self._paginate(stmt, page)
        return [row[0] for row in rows], total

    async def events(
        self, page: PageParams, *, when: EventWhen, include_placeholders: bool
    ) -> tuple[Sequence[Event], int]:
        now = datetime.now(UTC)
        stmt = select(Event).where(Event.status != EventStatus.DRAFT, Event.deleted_at.is_(None))
        if when == "upcoming":
            stmt = stmt.where(Event.starts_at >= now).order_by(Event.starts_at)
        elif when == "past":
            stmt = stmt.where(Event.starts_at < now).order_by(Event.starts_at.desc())
        else:
            stmt = stmt.order_by(Event.starts_at.desc())
        if not include_placeholders:
            stmt = stmt.where(Event.is_placeholder.is_(False))
        rows, total = await self._paginate(stmt, page)
        return [row[0] for row in rows], total
