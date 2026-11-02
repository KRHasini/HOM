from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, Header, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.api.deps import (
    get_app_settings,
    get_lead_service,
    get_mailer,
    get_session_factory,
)
from app.core.config import Settings
from app.core.errors import ERROR_RESPONSES, AppError
from app.core.security import client_ip, issue_form_token
from app.modules.leads.schemas import IDEMPOTENCY_KEY, FormTokenResponse, LeadCreate, LeadCreated
from app.modules.leads.service import LeadService, SubmissionContext, notify_lead
from app.modules.notifications.base import Mailer

router = APIRouter(prefix="/leads", tags=["leads"])

SUCCESS_MESSAGE = "Thank you. Your request has been received."


@router.get("/form-token", response_model=FormTokenResponse, summary="Issue a form timing token")
async def form_token(
    response: Response, settings: Settings = Depends(get_app_settings)
) -> FormTokenResponse:
    response.headers["Cache-Control"] = "no-store"
    token = issue_form_token(settings.form_token_secret.get_secret_value())
    return FormTokenResponse(
        token=token.token, issued_at=token.issued_at_ms, min_seconds=settings.form_min_seconds
    )


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=LeadCreated,
    responses=ERROR_RESPONSES,
    summary="Create a lead from the trial or contact form",
)
async def create_lead(
    payload: LeadCreate,
    request: Request,
    background: BackgroundTasks,
    service: LeadService = Depends(get_lead_service),
    settings: Settings = Depends(get_app_settings),
    mailer: Mailer = Depends(get_mailer),
    session_factory: async_sessionmaker[AsyncSession] = Depends(get_session_factory),
    idempotency_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None,
) -> LeadCreated:
    if idempotency_key is not None and not IDEMPOTENCY_KEY.match(idempotency_key):
        raise AppError("Invalid Idempotency-Key header.", code="invalid_idempotency_key")

    result = await service.create(
        payload,
        SubmissionContext(
            ip=client_ip(request, settings),
            user_agent=request.headers.get("user-agent"),
            idempotency_key=idempotency_key,
        ),
    )
    if result.created:
        background.add_task(notify_lead, result.lead.id, session_factory, mailer, settings)
    return LeadCreated(id=result.lead.id, message=SUCCESS_MESSAGE)
