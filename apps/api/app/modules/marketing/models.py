from __future__ import annotations

import uuid
from datetime import datetime
from enum import StrEnum

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TimestampedModel


def _str_enum(enum_cls: type[StrEnum], name: str) -> Enum:
    return Enum(
        enum_cls,
        name=name,
        native_enum=False,
        create_constraint=True,
        length=32,
        values_callable=lambda e: [m.value for m in e],
    )


class MediaKind(StrEnum):
    IMAGE = "image"
    VIDEO = "video"


class EventStatus(StrEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CANCELLED = "cancelled"


class Testimonial(TimestampedModel):
    __tablename__ = "testimonials"

    slug: Mapped[str] = mapped_column(String(64), unique=True)
    name: Mapped[str] = mapped_column(String(80))
    relation: Mapped[str] = mapped_column(String(16))
    quote: Mapped[str] = mapped_column(Text)
    class_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("dance_classes.id", ondelete="SET NULL"), index=True
    )
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    is_placeholder: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")


class GalleryMedia(TimestampedModel):
    __tablename__ = "gallery_media"

    path: Mapped[str] = mapped_column(String(255), unique=True)
    kind: Mapped[MediaKind] = mapped_column(_str_enum(MediaKind, "media_kind"))
    category: Mapped[str] = mapped_column(String(32), index=True)
    caption: Mapped[str] = mapped_column(String(255))
    width: Mapped[int] = mapped_column(Integer)
    height: Mapped[int] = mapped_column(Integer)
    poster_path: Mapped[str | None] = mapped_column(String(255))
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")


class Event(TimestampedModel):
    __tablename__ = "events"

    slug: Mapped[str] = mapped_column(String(96), unique=True)
    title: Mapped[str] = mapped_column(String(160))
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    venue: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    image_path: Mapped[str | None] = mapped_column(String(255))
    registration_url: Mapped[str | None] = mapped_column(String(512))
    status: Mapped[EventStatus] = mapped_column(
        _str_enum(EventStatus, "event_status"), default=EventStatus.PUBLISHED
    )
    is_placeholder: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
