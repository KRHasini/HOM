from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_app_settings
from app.core.config import Settings
from app.core.db import get_session
from app.modules.instructors.schemas import InstructorOut
from app.modules.instructors.service import InstructorService

router = APIRouter(prefix="/instructors", tags=["instructors"])


def get_instructor_service(
    session: AsyncSession = Depends(get_session), settings: Settings = Depends(get_app_settings)
) -> InstructorService:
    return InstructorService(session, settings)


@router.get("", response_model=list[InstructorOut], summary="List instructors")
async def list_instructors(
    service: InstructorService = Depends(get_instructor_service),
) -> list[InstructorOut]:
    return await service.list()


@router.get("/{slug}", response_model=InstructorOut, summary="Get an instructor by slug")
async def get_instructor(
    slug: str, service: InstructorService = Depends(get_instructor_service)
) -> InstructorOut:
    return await service.get(slug)
