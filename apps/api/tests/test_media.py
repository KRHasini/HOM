from __future__ import annotations

from pathlib import Path

import pytest

from app.modules.media.storage import LocalMediaStorage


async def test_local_storage_round_trip(tmp_path: Path) -> None:
    storage = LocalMediaStorage(tmp_path, "/media")
    stored = await storage.save("gallery/photo-100.jpg", b"jpeg-bytes", "image/jpeg")

    assert stored.url == "/media/gallery/photo-100.jpg"
    assert (tmp_path / "gallery" / "photo-100.jpg").read_bytes() == b"jpeg-bytes"

    await storage.delete("gallery/photo-100.jpg")
    assert not (tmp_path / "gallery" / "photo-100.jpg").exists()


@pytest.mark.parametrize("key", ["../etc/passwd", "/abs/path.jpg", "a/../../b.jpg", "Bad Key.jpg"])
async def test_rejects_unsafe_keys(tmp_path: Path, key: str) -> None:
    storage = LocalMediaStorage(tmp_path, "/media")
    with pytest.raises(ValueError):
        await storage.save(key, b"x", "image/jpeg")
