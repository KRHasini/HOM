"""Idempotently load website content into the content tables.

Usage::

    python -m app.scripts.seed [--file path/to/content.json]

The JSON snapshot is produced from the typed web content layer with
``pnpm content:export`` so the website and the database never drift.
"""

from __future__ import annotations

import argparse
import asyncio
import json
from datetime import datetime
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field
from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.db import create_engine, create_session_factory
from app.core.logging import configure_logging, get_logger
from app.modules.classes.models import ClassInstructor, DanceClass
from app.modules.instructors.models import Instructor
from app.modules.marketing.models import Event, EventStatus, GalleryMedia, MediaKind, Testimonial

DEFAULT_FILE = Path(__file__).parent / "seed_data" / "content.json"
logger = get_logger("seed")


class SeedClass(BaseModel):
    slug: str
    name: str
    tagline: str
    description: str
    category: str
    age_group: str
    level: str
    duration_minutes: int | None = None
    accent: str
    sort_order: int = 0
    instructor_slugs: list[str] = Field(default_factory=list)


class SeedInstructor(BaseModel):
    slug: str
    name: str
    role: str
    bio: str
    specialties: list[str] = Field(default_factory=list)
    photo_path: str | None = None
    is_placeholder: bool = False
    sort_order: int = 0


class SeedTestimonial(BaseModel):
    slug: str
    name: str
    relation: str
    quote: str
    class_slug: str | None = None
    is_placeholder: bool = True
    sort_order: int = 0


class SeedGallery(BaseModel):
    path: str
    kind: MediaKind
    category: str
    caption: str
    width: int
    height: int
    poster_path: str | None = None
    sort_order: int = 0


class SeedEvent(BaseModel):
    slug: str
    title: str
    starts_at: datetime
    ends_at: datetime | None = None
    venue: str
    description: str
    image_path: str | None = None
    registration_url: str | None = None
    status: EventStatus = EventStatus.PUBLISHED
    is_placeholder: bool = False


class SeedContent(BaseModel):
    classes: list[SeedClass]
    instructors: list[SeedInstructor]
    testimonials: list[SeedTestimonial] = Field(default_factory=list)
    gallery: list[SeedGallery] = Field(default_factory=list)
    events: list[SeedEvent] = Field(default_factory=list)


async def _upsert(session: AsyncSession, model: Any, rows: list[dict[str, Any]], key: str) -> None:
    if not rows:
        return
    stmt = insert(model).values(rows)
    updatable = {c: stmt.excluded[c] for c in rows[0] if c != key}
    await session.execute(stmt.on_conflict_do_update(index_elements=[key], set_=updatable))


async def seed(session: AsyncSession, content: SeedContent) -> dict[str, int]:
    await _upsert(
        session,
        Instructor,
        [i.model_dump() for i in content.instructors],
        "slug",
    )
    await _upsert(
        session,
        DanceClass,
        [c.model_dump(exclude={"instructor_slugs"}) | {"is_active": True} for c in content.classes],
        "slug",
    )

    class_ids = dict((await session.execute(select(DanceClass.slug, DanceClass.id))).all())
    instructor_ids = dict((await session.execute(select(Instructor.slug, Instructor.id))).all())

    # Rebuild class ↔ instructor links for the seeded classes.
    seeded_ids = [class_ids[c.slug] for c in content.classes]
    await session.execute(delete(ClassInstructor).where(ClassInstructor.class_id.in_(seeded_ids)))
    links = [
        {"class_id": class_ids[c.slug], "instructor_id": instructor_ids[slug]}
        for c in content.classes
        for slug in c.instructor_slugs
        if slug in instructor_ids
    ]
    if links:
        await session.execute(insert(ClassInstructor).values(links))

    await _upsert(
        session,
        Testimonial,
        [
            t.model_dump(exclude={"class_slug"}) | {"class_id": class_ids.get(t.class_slug or "")}
            for t in content.testimonials
        ],
        "slug",
    )
    await _upsert(session, GalleryMedia, [g.model_dump() for g in content.gallery], "path")
    await _upsert(session, Event, [e.model_dump() for e in content.events], "slug")
    await session.commit()

    return {
        "classes": len(content.classes),
        "instructors": len(content.instructors),
        "class_instructors": len(links),
        "testimonials": len(content.testimonials),
        "gallery": len(content.gallery),
        "events": len(content.events),
    }


async def main(path: Path) -> None:
    settings = get_settings()
    configure_logging(settings)
    raw = await asyncio.to_thread(path.read_text, encoding="utf-8")
    content = SeedContent.model_validate(json.loads(raw))
    engine = create_engine(settings)
    try:
        async with create_session_factory(engine)() as session:
            counts = await seed(session, content)
        logger.info("seed.complete", **counts)
    finally:
        await engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--file", type=Path, default=DEFAULT_FILE)
    asyncio.run(main(parser.parse_args().file))
