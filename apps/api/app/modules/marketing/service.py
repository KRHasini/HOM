from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.pagination import Page, PageParams
from app.modules.marketing.repository import MarketingRepository
from app.modules.marketing.schemas import EventOut, EventWhen, GalleryItemOut, TestimonialOut


class MarketingService:
    def __init__(self, session: AsyncSession, settings: Settings) -> None:
        self.repo = MarketingRepository(session)
        self.include_placeholders = not settings.is_production

    async def testimonials(self, page: PageParams, class_slug: str | None) -> Page[TestimonialOut]:
        rows, total = await self.repo.testimonials(
            page, class_slug=class_slug, include_placeholders=self.include_placeholders
        )
        items = [
            TestimonialOut(
                slug=t.slug, name=t.name, relation=t.relation, quote=t.quote, class_slug=slug
            )
            for t, slug in rows
        ]
        return Page(items=items, page=page.page, page_size=page.page_size, total=total)

    async def gallery(
        self, page: PageParams, category: str | None, kind: str | None
    ) -> Page[GalleryItemOut]:
        rows, total = await self.repo.gallery(page, category=category, kind=kind)
        items = [GalleryItemOut.model_validate(m, from_attributes=True) for m in rows]
        return Page(items=items, page=page.page, page_size=page.page_size, total=total)

    async def events(self, page: PageParams, when: EventWhen) -> Page[EventOut]:
        rows, total = await self.repo.events(
            page, when=when, include_placeholders=self.include_placeholders
        )
        items = [EventOut.model_validate(e, from_attributes=True) for e in rows]
        return Page(items=items, page=page.page, page_size=page.page_size, total=total)
