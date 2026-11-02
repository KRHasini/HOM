from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_app_settings
from app.core.config import Settings
from app.core.db import get_session
from app.core.pagination import Page, PageParams, page_params
from app.modules.marketing.models import MediaKind
from app.modules.marketing.schemas import EventOut, EventWhen, GalleryItemOut, TestimonialOut
from app.modules.marketing.service import MarketingService

router = APIRouter(tags=["marketing"])


def get_marketing_service(
    session: AsyncSession = Depends(get_session), settings: Settings = Depends(get_app_settings)
) -> MarketingService:
    return MarketingService(session, settings)


@router.get("/testimonials", response_model=Page[TestimonialOut], summary="List testimonials")
async def list_testimonials(
    class_slug: str | None = Query(None, alias="class", max_length=64),
    page: PageParams = Depends(page_params),
    service: MarketingService = Depends(get_marketing_service),
) -> Page[TestimonialOut]:
    return await service.testimonials(page, class_slug)


@router.get("/gallery", response_model=Page[GalleryItemOut], summary="List gallery media")
async def list_gallery(
    category: str | None = Query(None, max_length=32),
    kind: MediaKind | None = Query(None),
    page: PageParams = Depends(page_params),
    service: MarketingService = Depends(get_marketing_service),
) -> Page[GalleryItemOut]:
    return await service.gallery(page, category, kind.value if kind else None)


@router.get("/events", response_model=Page[EventOut], summary="List events")
async def list_events(
    when: EventWhen = Query("upcoming"),
    page: PageParams = Depends(page_params),
    service: MarketingService = Depends(get_marketing_service),
) -> Page[EventOut]:
    return await service.events(page, when)
