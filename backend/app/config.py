import os

from dotenv import load_dotenv

load_dotenv()

APP_VERSION = "v1"

JWT_ISSUER = "http://localhost:8000/"

PASSWORD_REGEX = r"^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,}$"

KEYS_LOCATION = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "keys/")

MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING", None)
MONGO_DATABASE_NAME = os.getenv("MONGO_DATABASE_NAME", None)

JWT_SECRET = os.getenv("JWT_SECRET", None)

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", None)
BING_MAPS_API_KEY = os.getenv("BING_MAPS_API_KEY", None)

FIREBASE_KEY = os.path.join(KEYS_LOCATION, "firebase-admin.json")
FIREBASE_ENCODED_JSON_KEY = os.getenv("FIREBASE_ADMIN_ENCODED_JSON", None)
FIREBASE_BUCKET_LOCATION = os.getenv("FIREBASE_BUCKET_LOCATION", None)

SENDBIRD_APP_ID = os.getenv("SENDBIRD_APP_ID", None)
SENDBIRD_API_KEY = os.getenv("SENDBIRD_API_KEY", None)

PAYPAL_ENDPOINT = "https://api-m.sandbox.paypal.com"
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", None)
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET", None)