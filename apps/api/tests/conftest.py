from __future__ import annotations

import os
import time
from collections.abc import AsyncIterator
from pathlib import Path
from typing import Any

import pytest
from alembic import command
from alembic.config import Config
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.security import issue_form_token
from app.main import create_app
from app.modules.notifications.base import EmailMessage, NotificationError

API_ROOT = Path(__file__).resolve().parents[1]
TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+asyncpg://hom:hom@localhost:5432/hom_test"
)
TABLES = (
    "lead_events, bookings, leads, class_instructors, testimonials, "
    "gallery_media, events, dance_classes, instructors"
)


class RecordingMailer:
    def __init__(self) -> None:
        self.sent: list[EmailMessage] = []

    async def send(self, message: EmailMessage) -> None:
        self.sent.append(message)


class FailingMailer:
    async def send(self, message: EmailMessage) -> None:
        raise NotificationError("SMTP down")


def make_settings(**overrides: Any) -> Settings:
    base: dict[str, Any] = {
        "environment": "test",
        "database_url": TEST_DATABASE_URL,
        "log_json": False,
        "log_level": "WARNING",
        "form_min_seconds": 2.0,
        "lead_rate_limit": 5,
        "lead_rate_window_seconds": 600,
        "web_origins": ["http://localhost:3000"],
        "db_pool_size": 2,
        "db_max_overflow": 0,
    }
    return Settings(**(base | overrides))


@pytest.fixture(scope="session", autouse=True)
def migrated_database() -> None:
    """Exercise the real migrations: downgrade to base, then upgrade to head."""
    cfg = Config(str(API_ROOT / "alembic.ini"))
    cfg.attributes["database_url"] = TEST_DATABASE_URL
    cfg.attributes["configure_logger"] = False
    command.downgrade(cfg, "base")
    command.upgrade(cfg, "head")


@pytest.fixture(scope="session")
def settings() -> Settings:
    return make_settings()


@pytest.fixture(scope="session")
async def app(settings: Settings) -> AsyncIterator[FastAPI]:
    application = create_app(settings)
    application.state.mailer = RecordingMailer()
    yield application
    await application.state.engine.dispose()


@pytest.fixture(autouse=True)
async def clean_state(app: FastAPI) -> AsyncIterator[None]:
    async with app.state.engine.begin() as conn:
        await conn.execute(text(f"TRUNCATE {TABLES} CASCADE"))
    app.state.lead_rate_limiter.reset()
    app.state.mailer = RecordingMailer()
    yield


@pytest.fixture
async def client(app: FastAPI) -> AsyncIterator[AsyncClient]:
    transport = ASGITransport(app=app, client=("203.0.113.7", 50000))
    async with AsyncClient(transport=transport, base_url="http://testserver") as http:
        yield http


@pytest.fixture
async def session(app: FastAPI) -> AsyncIterator[AsyncSession]:
    async with app.state.session_factory() as db:
        yield db


def form_token(settings: Settings, *, age_seconds: float = 5.0) -> str:
    issued = int((time.time() - age_seconds) * 1000)
    return issue_form_token(settings.form_token_secret.get_secret_value(), now_ms=issued).token


@pytest.fixture
def lead_payload(settings: Settings) -> dict[str, Any]:
    return {
        "enquiry_type": "trial",
        "name": "Ananya Rao",
        "phone": "97425 08862",
        "email": "ananya@example.com",
        "audience": "child",
        "age": 9,
        "class_slug": "bharatanatyam",
        "preferred_days": ["sat", "sun"],
        "preferred_time": "morning",
        "message": "Looking for a weekend batch.",
        "consent": True,
        "source": "website:trial-form",
        "utm_source": "instagram",
        "utm_medium": "social",
        "utm_campaign": "launch",
        "referrer": "https://www.instagram.com/",
        "landing_page": "/classes/bharatanatyam",
        "website": "",
        "form_token": form_token(settings),
    }
