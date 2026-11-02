from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.errors import NotFoundError
from app.modules.classes.models import DanceClass
from app.modules.classes.repository import ClassRepository
from app.modules.classes.schemas import ClassOut


def _to_out(item: DanceClass, instructors: list[str]) -> ClassOut:
    return ClassOut(
        slug=item.slug,
        name=item.name,
        tagline=item.tagline,
        description=item.description,
        category=item.category,
        age_group=item.age_group,
        level=item.level,
        duration_minutes=item.duration_minutes,
        accent=item.accent,
        sort_order=item.sort_order,
        instructor_slugs=instructors,
    )


class ClassService:
    def __init__(self, session: AsyncSession, settings: Settings) -> None:
        self.repo = ClassRepository(session)
        self.include_placeholders = not settings.is_production

    async def list(self, category: str | None = None) -> list[ClassOut]:
        classes = await self.repo.list_active(category)
        links = await self.repo.instructor_slugs(
            [c.id for c in classes], include_placeholders=self.include_placeholders
        )
        return [_to_out(c, links.get(c.id, [])) for c in classes]

    async def get(self, slug: str) -> ClassOut:
        item = await self.repo.get_by_slug(slug)
        if item is None:
            raise NotFoundError(f"No class found for '{slug}'.")
        links = await self.repo.instructor_slugs(
            [item.id], include_placeholders=self.include_placeholders
        )
        return _to_out(item, links.get(item.id, []))
