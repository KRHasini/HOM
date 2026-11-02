from __future__ import annotations

from pydantic import BaseModel


class ClassOut(BaseModel):
    slug: str
    name: str
    tagline: str
    description: str
    category: str
    age_group: str
    level: str
    duration_minutes: int | None
    accent: str
    sort_order: int
    instructor_slugs: list[str]
