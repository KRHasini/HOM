from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel

from app.modules.marketing.models import EventStatus, MediaKind


class TestimonialOut(BaseModel):
    slug: str
    name: str
    relation: str
    quote: str
    class_slug: str | None


class GalleryItemOut(BaseModel):
    path: str
    kind: MediaKind
    category: str
    caption: str
    width: int
    height: int
    poster_path: str | None


class EventOut(BaseModel):
    slug: str
    title: str
    starts_at: datetime
    ends_at: datetime | None
    venue: str
    description: str
    image_path: str | None
    registration_url: str | None
    status: EventStatus


EventWhen = Literal["upcoming", "past", "all"]
