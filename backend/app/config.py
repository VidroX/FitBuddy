import os

APP_VERSION = "v1"

JWT_ISSUER = "http://localhost:8000/"

MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING", None)
MONGO_DATABASE_NAME = os.getenv("MONGO_DATABASE_NAME", None)
JWT_SECRET = os.getenv("JWT_SECRET", None)
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", None)
BING_MAPS_API_KEY = os.getenv("BING_MAPS_API_KEY", None)