"""Shared FastAPI dependencies. Infrastructure lives on ``app.state`` so tests can swap it."""

from __future__ import annotations

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.config import Settings
from app.core.db import get_session
from app.core.rate_limit import RateLimiter
from app.modules.leads.service import LeadService
from app.modules.media.storage import MediaStorage
from app.modules.notifications.base import Mailer


def get_app_settings(request: Request) -> Settings:
    settings: Settings = request.app.state.settings
    return settings


def get_mailer(request: Request) -> Mailer:
    mailer: Mailer = request.app.state.mailer
    return mailer


def get_rate_limiter(request: Request) -> RateLimiter:
    limiter: RateLimiter = request.app.state.lead_rate_limiter
    return limiter


def get_session_factory(request: Request) -> async_sessionmaker[AsyncSession]:
    factory: async_sessionmaker[AsyncSession] = request.app.state.session_factory
    return factory


def get_media_storage(request: Request) -> MediaStorage:
    storage: MediaStorage = request.app.state.media_storage
    return storage


def get_lead_service(
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_app_settings),
    limiter: RateLimiter = Depends(get_rate_limiter),
) -> LeadService:
    return LeadService(session, settings, limiter)
