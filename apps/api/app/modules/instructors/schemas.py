from __future__ import annotations

from pydantic import BaseModel


class InstructorOut(BaseModel):
    slug: str
    name: str
    role: str
    bio: str
    specialties: list[str]
    photo_path: str | None
    class_slugs: list[str]
