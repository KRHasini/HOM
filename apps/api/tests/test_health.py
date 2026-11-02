from __future__ import annotations

from httpx import ASGITransport, AsyncClient

from app.main import create_app
from tests.conftest import make_settings


async def test_liveness(client: AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_readiness_checks_database(client: AsyncClient) -> None:
    response = await client.get("/health/ready")
    assert response.status_code == 200
    assert response.json()["database"] == "up"


async def test_readiness_reports_database_down() -> None:
    app = create_app(
        make_settings(database_url="postgresql+asyncpg://nobody:nope@127.0.0.1:1/missing")
    )
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://t") as http:
        response = await http.get("/health/ready")
    await app.state.engine.dispose()
    assert response.status_code == 503


async def test_docs_hidden_in_production() -> None:
    app = create_app(make_settings(environment="production"))
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://t") as http:
        assert (await http.get("/docs")).status_code == 404
        assert (await http.get("/openapi.json")).status_code == 404
    await app.state.engine.dispose()


async def test_unknown_route_uses_error_envelope(client: AsyncClient) -> None:
    response = await client.get("/v1/does-not-exist")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "not_found"
