import os

from app.routers import activities_router, auth_router, matches_router
from .services.database_service import DatabaseService
from . import config
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routers import user_router
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(activities_router.router)
app.include_router(matches_router.router)


@app.on_event("startup")
async def startup_event():
    await DatabaseService.connect()


@app.get("/")
def read_root():
    return {
        "name": "FitBuddy Experimental API",
        "version": config.APP_VERSION,
        "description": "FitBuddy is a one-stop web application developed by Douglas College students as a term project. It is designed for people searching for buddies to do workout routines or sports in a similar field of interests."
    }
