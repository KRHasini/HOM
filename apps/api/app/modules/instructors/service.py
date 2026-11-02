from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.errors import NotFoundError
from app.modules.instructors.models import Instructor
from app.modules.instructors.repository import InstructorRepository
from app.modules.instructors.schemas import InstructorOut


def _to_out(item: Instructor, classes: list[str]) -> InstructorOut:
    return InstructorOut(
        slug=item.slug,
        name=item.name,
        role=item.role,
        bio=item.bio,
        specialties=list(item.specialties),
        photo_path=item.photo_path,
        class_slugs=classes,
    )


class InstructorService:
    def __init__(self, session: AsyncSession, settings: Settings) -> None:
        self.repo = InstructorRepository(session)
        self.include_placeholders = not settings.is_production

    async def list(self) -> list[InstructorOut]:
        items = await self.repo.list_visible(include_placeholders=self.include_placeholders)
        links = await self.repo.class_slugs([i.id for i in items])
        return [_to_out(i, links.get(i.id, [])) for i in items]

    async def get(self, slug: str) -> InstructorOut:
        item = await self.repo.get_by_slug(slug, include_placeholders=self.include_placeholders)
        if item is None:
            raise NotFoundError(f"No instructor found for '{slug}'.")
        links = await self.repo.class_slugs([item.id])
        return _to_out(item, links.get(item.id, []))
