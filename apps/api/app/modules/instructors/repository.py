from __future__ import annotations

import uuid
from collections import defaultdict
from collections.abc import Sequence

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.classes.models import ClassInstructor, DanceClass
from app.modules.instructors.models import Instructor


class InstructorRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def _visible(self, include_placeholders: bool) -> Select[Instructor]:
        stmt = select(Instructor).where(Instructor.is_active, Instructor.deleted_at.is_(None))
        if not include_placeholders:
            stmt = stmt.where(Instructor.is_placeholder.is_(False))
        return stmt

    async def list_visible(self, *, include_placeholders: bool) -> Sequence[Instructor]:
        rows = await self.session.scalars(
            self._visible(include_placeholders).order_by(Instructor.sort_order, Instructor.name)
        )
        return rows.all()

    async def get_by_slug(self, slug: str, *, include_placeholders: bool) -> Instructor | None:
        result: Instructor | None = await self.session.scalar(
            self._visible(include_placeholders).where(Instructor.slug == slug)
        )
        return result

    async def class_slugs(self, instructor_ids: Sequence[uuid.UUID]) -> dict[uuid.UUID, list[str]]:
        if not instructor_ids:
            return {}
        stmt = (
            select(ClassInstructor.instructor_id, DanceClass.slug)
            .join(DanceClass, DanceClass.id == ClassInstructor.class_id)
            .where(ClassInstructor.instructor_id.in_(instructor_ids), DanceClass.is_active)
            .order_by(DanceClass.sort_order)
        )
        mapping: dict[uuid.UUID, list[str]] = defaultdict(list)
        for instructor_id, slug in (await self.session.execute(stmt)).all():
            mapping[instructor_id].append(slug)
        return mapping
