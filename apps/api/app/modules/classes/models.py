from __future__ import annotations

import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, SmallInteger, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TimestampedModel


class DanceClass(TimestampedModel):
    __tablename__ = "dance_classes"

    slug: Mapped[str] = mapped_column(String(64), unique=True)
    name: Mapped[str] = mapped_column(String(80))
    tagline: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(32), server_default="dance")
    age_group: Mapped[str] = mapped_column(String(64))
    level: Mapped[str] = mapped_column(String(64))
    duration_minutes: Mapped[int | None] = mapped_column(SmallInteger)
    accent: Mapped[str] = mapped_column(String(16))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")


class ClassInstructor(TimestampedModel):
    __tablename__ = "class_instructors"
    __table_args__ = (UniqueConstraint("class_id", "instructor_id"),)

    class_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("dance_classes.id", ondelete="CASCADE"), index=True
    )
    instructor_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("instructors.id", ondelete="CASCADE"), index=True
    )
