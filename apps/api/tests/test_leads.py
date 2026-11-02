from __future__ import annotations

import uuid
from typing import Any

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.modules.leads.models import Lead, LeadEvent, LeadEventType, LeadStatus
from tests.conftest import FailingMailer, RecordingMailer, form_token


async def _lead_count(session: AsyncSession) -> int:
    return int(await session.scalar(select(func.count()).select_from(Lead)) or 0)


async def _events(session: AsyncSession, lead_id: str) -> list[LeadEventType]:
    rows = await session.scalars(
        select(LeadEvent.event)
        .where(LeadEvent.lead_id == uuid.UUID(lead_id))
        .order_by(LeadEvent.created_at)
    )
    return list(rows.all())


async def test_form_token_endpoint(client: AsyncClient) -> None:
    response = await client.get("/v1/leads/form-token")
    assert response.status_code == 200
    body = response.json()
    assert "." in body["token"]
    assert body["min_seconds"] == 2.0
    assert response.headers["cache-control"] == "no-store"


async def test_create_trial_lead_stores_everything_and_notifies(
    client: AsyncClient, app: FastAPI, session: AsyncSession, lead_payload: dict[str, Any]
) -> None:
    response = await client.post("/v1/leads", json=lead_payload)

    assert response.status_code == 201
    body = response.json()
    assert set(body) == {"id", "message"}

    lead = await session.get(Lead, uuid.UUID(body["id"]))
    assert lead is not None
    assert lead.phone == "+919742508862"
    assert lead.status is LeadStatus.NEW
    assert lead.utm_source == "instagram"
    assert lead.utm_campaign == "launch"
    assert lead.landing_page == "/classes/bharatanatyam"
    assert lead.preferred_days == ["sat", "sun"]
    assert lead.ip_hash and lead.ip_hash != "203.0.113.7"
    assert len(lead.ip_hash) == 64

    assert await _events(session, body["id"]) == [LeadEventType.CREATED, LeadEventType.NOTIFIED]
    mailer: RecordingMailer = app.state.mailer
    assert len(mailer.sent) == 1
    message = mailer.sent[0]
    assert "tel:+919742508862" in message.text
    assert "https://wa.me/919742508862" in message.text
    assert "Ananya Rao" in message.subject


async def test_email_failure_does_not_fail_request(
    client: AsyncClient, app: FastAPI, session: AsyncSession, lead_payload: dict[str, Any]
) -> None:
    app.state.mailer = FailingMailer()
    response = await client.post("/v1/leads", json=lead_payload)

    assert response.status_code == 201
    assert await _events(session, response.json()["id"]) == [
        LeadEventType.CREATED,
        LeadEventType.NOTIFY_FAILED,
    ]


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("name", "A"),
        ("name", "x" * 81),
        ("phone", "12345"),
        ("phone", "not a phone"),
        ("email", "not-an-email"),
        ("message", "x" * 1001),
        ("consent", False),
        ("age", 120),
        ("class_slug", "Bad Slug!"),
        ("preferred_days", ["funday"]),
    ],
)
async def test_validation_errors_use_error_envelope(
    client: AsyncClient, lead_payload: dict[str, Any], field: str, value: object
) -> None:
    response = await client.post("/v1/leads", json=lead_payload | {field: value})

    assert response.status_code == 422
    error = response.json()["error"]
    assert error["code"] == "validation_error"
    assert any(detail["field"] == field for detail in error["details"])


async def test_contact_lead_with_minimal_fields(
    client: AsyncClient, settings: Settings, session: AsyncSession
) -> None:
    payload = {
        "enquiry_type": "contact",
        "name": "Ravi",
        "phone": "+91 98450 12345",
        "email": "",
        "message": "Do you run weekend batches?",
        "consent": True,
        "form_token": form_token(settings),
    }
    response = await client.post("/v1/leads", json=payload)
    assert response.status_code == 201
    lead = await session.get(Lead, uuid.UUID(response.json()["id"]))
    assert lead is not None
    assert lead.email is None


async def test_unknown_fields_are_rejected(
    client: AsyncClient, lead_payload: dict[str, Any]
) -> None:
    response = await client.post("/v1/leads", json=lead_payload | {"status": "CONVERTED"})
    assert response.status_code == 422


async def test_honeypot_rejects(
    client: AsyncClient, session: AsyncSession, lead_payload: dict[str, Any]
) -> None:
    response = await client.post("/v1/leads", json=lead_payload | {"website": "http://spam"})
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "submission_rejected"
    assert await _lead_count(session) == 0


async def test_too_fast_submission_rejected(
    client: AsyncClient, settings: Settings, lead_payload: dict[str, Any]
) -> None:
    payload = lead_payload | {"form_token": form_token(settings, age_seconds=0.5)}
    response = await client.post("/v1/leads", json=payload)
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "submission_rejected"


async def test_forged_token_rejected(client: AsyncClient, lead_payload: dict[str, Any]) -> None:
    response = await client.post("/v1/leads", json=lead_payload | {"form_token": "1700000.abc"})
    assert response.status_code == 400


async def test_expired_token_rejected(
    client: AsyncClient, settings: Settings, lead_payload: dict[str, Any]
) -> None:
    stale = form_token(settings, age_seconds=settings.form_token_max_age_seconds + 60)
    response = await client.post("/v1/leads", json=lead_payload | {"form_token": stale})
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "form_expired"


async def test_rate_limit_per_ip(
    client: AsyncClient, settings: Settings, lead_payload: dict[str, Any]
) -> None:
    for _ in range(settings.lead_rate_limit):
        assert (await client.post("/v1/leads", json=lead_payload)).status_code == 201

    response = await client.post("/v1/leads", json=lead_payload)
    assert response.status_code == 429
    assert response.json()["error"]["code"] == "rate_limited"
    assert int(response.headers["retry-after"]) > 0


async def test_idempotency_replay_returns_original(
    client: AsyncClient, app: FastAPI, session: AsyncSession, lead_payload: dict[str, Any]
) -> None:
    headers = {"Idempotency-Key": "form-session-1234abcd"}
    first = await client.post("/v1/leads", json=lead_payload, headers=headers)
    second = await client.post("/v1/leads", json=lead_payload, headers=headers)

    assert first.status_code == second.status_code == 201
    assert first.json() == second.json()
    assert await _lead_count(session) == 1
    mailer: RecordingMailer = app.state.mailer
    assert len(mailer.sent) == 1


async def test_invalid_idempotency_key(client: AsyncClient, lead_payload: dict[str, Any]) -> None:
    response = await client.post(
        "/v1/leads", json=lead_payload, headers={"Idempotency-Key": "bad key!"}
    )
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "invalid_idempotency_key"


async def test_cors_allows_only_configured_origin(client: AsyncClient) -> None:
    allowed = await client.options(
        "/v1/leads",
        headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"},
    )
    denied = await client.options(
        "/v1/leads",
        headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"},
    )
    assert allowed.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert "access-control-allow-origin" not in denied.headers


async def test_request_id_header(client: AsyncClient) -> None:
    response = await client.get("/health", headers={"X-Request-ID": "trace-12345678"})
    assert response.headers["x-request-id"] == "trace-12345678"
