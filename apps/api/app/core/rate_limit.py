"""Per-key sliding-window rate limiting.

Phase 1 runs a single API process, so an in-memory limiter is sufficient. The
``RateLimiter`` protocol lets a Redis-backed implementation drop in when the API is
scaled horizontally.
"""

from __future__ import annotations

import asyncio
import time
from collections import deque
from typing import Protocol


class RateLimiter(Protocol):
    async def hit(self, key: str) -> tuple[bool, int]:
        """Record an attempt. Returns ``(allowed, retry_after_seconds)``."""
        ...

    def reset(self) -> None: ...


class InMemoryRateLimiter:
    def __init__(self, limit: int, window_seconds: int, *, max_keys: int = 50_000) -> None:
        self._limit = limit
        self._window = window_seconds
        self._max_keys = max_keys
        self._hits: dict[str, deque[float]] = {}
        self._lock = asyncio.Lock()

    async def hit(self, key: str) -> tuple[bool, int]:
        now = time.monotonic()
        async with self._lock:
            bucket = self._hits.setdefault(key, deque())
            while bucket and now - bucket[0] >= self._window:
                bucket.popleft()
            if len(bucket) >= self._limit:
                retry_after = int(self._window - (now - bucket[0])) + 1
                return False, retry_after
            bucket.append(now)
            if len(self._hits) > self._max_keys:
                self._evict(now)
            return True, 0

    def _evict(self, now: float) -> None:
        stale = [k for k, b in self._hits.items() if not b or now - b[-1] >= self._window]
        for key in stale:
            del self._hits[key]

    def reset(self) -> None:
        self._hits.clear()
