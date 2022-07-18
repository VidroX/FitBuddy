import asyncio
import pytest_asyncio

from asgi_lifespan import LifespanManager
from httpx import AsyncClient

from app.main import app


@pytest_asyncio.fixture(scope="session")
def event_loop():
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    yield loop
    loop.close()

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac, LifespanManager(app):
        yield ac