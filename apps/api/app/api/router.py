"""Versioned API surface. New capabilities add a module router here — nothing else changes."""

from __future__ import annotations

from fastapi import APIRouter

from app.modules.classes.router import router as classes_router
from app.modules.instructors.router import router as instructors_router
from app.modules.leads.router import router as leads_router
from app.modules.marketing.router import router as marketing_router

v1_router = APIRouter(prefix="/v1")
v1_router.include_router(leads_router)
v1_router.include_router(classes_router)
v1_router.include_router(instructors_router)
v1_router.include_router(marketing_router)
