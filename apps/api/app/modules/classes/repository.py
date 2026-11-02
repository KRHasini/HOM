from __future__ import annotations

import uuid
from collections import defaultdict
from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.classes.models import ClassInstructor, DanceClass
from app.modules.instructors.models import Instructor


class ClassRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_active(self, category: str | None = None) -> Sequence[DanceClass]:
        stmt = select(DanceClass).where(DanceClass.is_active, DanceClass.deleted_at.is_(None))
        if category:
            stmt = stmt.where(DanceClass.category == category)
        rows = await self.session.scalars(stmt.order_by(DanceClass.sort_order, DanceClass.name))
        return rows.all()

    async def get_by_slug(self, slug: str) -> DanceClass | None:
        result: DanceClass | None = await self.session.scalar(
            select(DanceClass).where(
                DanceClass.slug == slug, DanceClass.is_active, DanceClass.deleted_at.is_(None)
            )
        )
        return result

    async def instructor_slugs(
        self, class_ids: Sequence[uuid.UUID], *, include_placeholders: bool
    ) -> dict[uuid.UUID, list[str]]:
        if not class_ids:
            return {}
        stmt = (
            select(ClassInstructor.class_id, Instructor.slug)
            .join(Instructor, Instructor.id == ClassInstructor.instructor_id)
            .where(
                ClassInstructor.class_id.in_(class_ids),
                Instructor.is_active,
                Instructor.deleted_at.is_(None),
            )
            .order_by(Instructor.sort_order)
        )
        if not include_placeholders:
            stmt = stmt.where(Instructor.is_placeholder.is_(False))
        mapping: dict[uuid.UUID, list[str]] = defaultdict(list)
        for class_id, slug in (await self.session.execute(stmt)).all():
            mapping[class_id].append(slug)
        return mapping
