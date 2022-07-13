import logging
import motor.motor_asyncio

from beanie import init_beanie
from app import config
from app.database.models.activity_model import ActivityModel
from app.database.models.user_model import UserModel


model_list = [
    ActivityModel,
    UserModel
]


class DatabaseService():
    @staticmethod
    async def connect():
        try:
            client = motor.motor_asyncio.AsyncIOMotorClient(config.MONGO_CONNECTION_STRING)
            db = client[config.MONGO_DATABASE_NAME]
            await init_beanie(database=db, document_models=model_list)

            logging.getLogger().info("Successfully connected to the database!")
        except Exception as e:
            logging.getLogger().error("Unable to connect to the database. Error: %s", e)
