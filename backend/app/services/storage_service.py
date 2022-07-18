import logging

from firebase_admin import credentials, initialize_app, storage
from app import config


class StorageServiceInstance():
    bucket = None
    
    def connect(self):
        try:
            cred = credentials.Certificate(config.FIREBASE_KEY)
            initialize_app(cred, {'storageBucket': config.FIREBASE_BUCKET_LOCATION})
            
            self.bucket = storage.bucket()
            
            logging.getLogger().info("Successfully connected to the Firebase Cloud Storage!")
        except Exception as e:
            logging.getLogger().error("Unable to connect to the Firebase Cloud Storage. Error: %s", e)

StorageService = StorageServiceInstance()