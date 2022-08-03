import base64
import json
import logging
import os

from firebase_admin import credentials, initialize_app, storage
from app import config


class StorageServiceInstance():
    bucket = None
    
    def connect(self):
        try:
            cert = config.FIREBASE_KEY if os.path.exists(config.FIREBASE_KEY) else \
                json.loads(base64.b64decode(config.FIREBASE_ENCODED_JSON_KEY).decode('utf-8'))
            
            cred = credentials.Certificate(cert)
            initialize_app(cred, {'storageBucket': config.FIREBASE_BUCKET_LOCATION})
            
            self.bucket = storage.bucket()
            
            logging.getLogger().info("Successfully connected to the Firebase Cloud Storage!")
        except Exception as e:
            logging.getLogger().error("Unable to connect to the Firebase Cloud Storage. Error: %s", e)

StorageService = StorageServiceInstance()