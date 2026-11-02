from __future__ import annotations

import json

from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import create_app
from app.scripts.seed import DEFAULT_FILE, SeedContent, seed
from tests.conftest import make_settings

SAMPLE = SeedContent.model_validate(
    {
        "classes": [
            {
                "slug": "yoga",
                "name": "Yoga",
                "tagline": "Balance, strength and serenity.",
                "description": "Breath-led practice.",
                "category": "fitness",
                "age_group": "Teens, Adults",
                "level": "All levels",
                "duration_minutes": 60,
                "accent": "#8A9A78",
                "sort_order": 2,
                "instructor_slugs": ["vignesh-k", "guest"],
            },
            {
                "slug": "bharatanatyam",
                "name": "Bharatanatyam",
                "tagline": "Begin your journey.",
                "description": "Classical dance.",
                "category": "traditional",
                "age_group": "Kids, Teens, Adults",
                "level": "Beginner to advanced",
                "accent": "#7A1F1A",
                "sort_order": 1,
                "instructor_slugs": ["vignesh-k"],
            },
        ],
        "instructors": [
            {
                "slug": "vignesh-k",
                "name": "Vignesh K",
                "role": "Founder and Lead Instructor",
                "bio": "Founder.",
                "specialties": ["Bharatanatyam"],
                "sort_order": 0,
            },
            {
                "slug": "guest",
                "name": "Guest Instructor",
                "role": "Yoga",
                "bio": "TBC",
                "is_placeholder": True,
                "sort_order": 1,
            },
        ],
        "testimonials": [
            {
                "slug": "t1",
                "name": "Parent",
                "relation": "parent",
                "quote": "Lovely.",
                "class_slug": "yoga",
                "is_placeholder": True,
            }
        ],
        "gallery": [
            {
                "path": "/media/gallery/photo-001.jpg",
                "kind": "image",
                "category": "performances",
                "caption": "On stage",
                "width": 2400,
                "height": 1600,
            }
        ],
        "events": [],
    }
)


async def test_seed_is_idempotent_and_classes_are_served(
    client: AsyncClient, session: AsyncSession
) -> None:
    first = await seed(session, SAMPLE)
    second = await seed(session, SAMPLE)
    assert first == second

    response = await client.get("/v1/classes")
    assert response.status_code == 200
    classes = response.json()
    assert [c["slug"] for c in classes] == ["bharatanatyam", "yoga"]
    assert classes[1]["instructor_slugs"] == ["vignesh-k", "guest"]

    detail = await client.get("/v1/classes/yoga")
    assert detail.json()["accent"] == "#8A9A78"

    missing = await client.get("/v1/classes/ballet")
    assert missing.status_code == 404
    assert missing.json()["error"]["code"] == "not_found"


async def test_placeholders_hidden_in_production(app: FastAPI, session: AsyncSession) -> None:
    await seed(session, SAMPLE)
    prod = create_app(make_settings(environment="production"))
    async with AsyncClient(transport=ASGITransport(app=prod), base_url="http://t") as http:
        instructors = (await http.get("/v1/instructors")).json()
        testimonials = (await http.get("/v1/testimonials")).json()
        yoga = (await http.get("/v1/classes/yoga")).json()
    await prod.state.engine.dispose()

    assert [i["slug"] for i in instructors] == ["vignesh-k"]
    assert testimonials["total"] == 0
    assert yoga["instructor_slugs"] == ["vignesh-k"]


async def test_marketing_endpoints_paginate_and_filter(
    client: AsyncClient, session: AsyncSession
) -> None:
    await seed(session, SAMPLE)
    gallery = (await client.get("/v1/gallery", params={"category": "performances"})).json()
    assert gallery["total"] == 1
    assert gallery["items"][0]["kind"] == "image"

    testimonials = (await client.get("/v1/testimonials", params={"class": "yoga"})).json()
    assert testimonials["total"] == 1

    events = await client.get("/v1/events", params={"when": "upcoming", "page_size": 5})
    assert events.status_code == 200
    assert events.json()["page_size"] == 5

    assert (await client.get("/v1/gallery", params={"page_size": 500})).status_code == 422


async def test_exported_site_content_is_valid_seed_data() -> None:
    """The committed snapshot exported from the web content layer must stay loadable."""
    if not DEFAULT_FILE.exists():
        return
    content = SeedContent.model_validate(json.loads(DEFAULT_FILE.read_text()))
    assert len(content.classes) == 8
    assert any(i.slug == "vignesh-k" for i in content.instructors)
