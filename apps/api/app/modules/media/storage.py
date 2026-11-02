"""Media storage abstraction.

Nothing uploads in Phase 1. Phase 2 admin uploads call ``MediaStorage.save``; a
cloud adapter (S3 / R2 / GCS) later implements the same three methods and is
selected in ``build_media_storage`` — no caller changes.
"""

from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Protocol

from app.core.config import Settings

_SAFE_KEY = re.compile(r"^[a-z0-9][a-z0-9._/-]{0,254}$")


@dataclass(frozen=True, slots=True)
class StoredMedia:
    key: str
    url: str
    size: int
    content_type: str


class MediaStorage(Protocol):
    async def save(self, key: str, data: bytes, content_type: str) -> StoredMedia: ...

    def url(self, key: str) -> str: ...

    async def delete(self, key: str) -> None: ...


def validate_key(key: str) -> str:
    """Reject absolute paths, traversal and unexpected characters."""
    normalized = str(PurePosixPath(key))
    if (
        not _SAFE_KEY.match(normalized)
        or normalized.startswith("/")
        or ".." in PurePosixPath(normalized).parts
    ):
        raise ValueError(f"Invalid media key: {key!r}")
    return normalized


class LocalMediaStorage:
    """Writes to a directory on the local filesystem (or a mounted Docker volume)."""

    def __init__(self, root: str | Path, base_url: str) -> None:
        self._root = Path(root).resolve()
        self._base_url = base_url.rstrip("/")

    def _path(self, key: str) -> Path:
        path = (self._root / validate_key(key)).resolve()
        if self._root not in path.parents:
            raise ValueError(f"Invalid media key: {key!r}")
        return path

    async def save(self, key: str, data: bytes, content_type: str) -> StoredMedia:
        path = self._path(key)

        def _write() -> None:
            path.parent.mkdir(parents=True, exist_ok=True)
            tmp = path.with_suffix(path.suffix + ".tmp")
            tmp.write_bytes(data)
            tmp.replace(path)

        await asyncio.to_thread(_write)
        return StoredMedia(key=key, url=self.url(key), size=len(data), content_type=content_type)

    def url(self, key: str) -> str:
        return f"{self._base_url}/{validate_key(key)}"

    async def delete(self, key: str) -> None:
        path = self._path(key)
        await asyncio.to_thread(path.unlink, True)


def build_media_storage(settings: Settings) -> MediaStorage:
    return LocalMediaStorage(settings.media_root, settings.media_base_url)
