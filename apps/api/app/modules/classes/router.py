from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_app_settings
from app.core.config import Settings
from app.core.db import get_session
from app.modules.classes.schemas import ClassOut
from app.modules.classes.service import ClassService

router = APIRouter(prefix="/classes", tags=["classes"])


def get_class_service(
    session: AsyncSession = Depends(get_session), settings: Settings = Depends(get_app_settings)
) -> ClassService:
    return ClassService(session, settings)


@router.get("", response_model=list[ClassOut], summary="List active classes")
async def list_classes(
    category: str | None = Query(None, max_length=32),
    service: ClassService = Depends(get_class_service),
) -> list[ClassOut]:
    return await service.list(category)


@router.get("/{slug}", response_model=ClassOut, summary="Get a class by slug")
async def get_class(slug: str, service: ClassService = Depends(get_class_service)) -> ClassOut:
    return await service.get(slug)
