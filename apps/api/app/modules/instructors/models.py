from __future__ import annotations

from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TimestampedModel


class Instructor(TimestampedModel):
    __tablename__ = "instructors"

    slug: Mapped[str] = mapped_column(String(64), unique=True)
    name: Mapped[str] = mapped_column(String(80))
    role: Mapped[str] = mapped_column(String(120))
    bio: Mapped[str] = mapped_column(Text)
    specialties: Mapped[list[str]] = mapped_column(ARRAY(String(64)), default=list)
    photo_path: Mapped[str | None] = mapped_column(String(255))
    is_placeholder: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
