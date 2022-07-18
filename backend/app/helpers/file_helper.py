import os
import uuid
import aiofiles
import urllib.parse

from PIL import Image
from typing import BinaryIO, List
from fastapi import BackgroundTasks, UploadFile

from app.services.storage_service import StorageService


async def _upload_image_to_firebase_cloud(blob, upload_file: UploadFile, mimetype: str):
    blob.upload_from_file(upload_file.file, content_type=mimetype)
    blob.make_public()
    await upload_file.close()

class FileHelper():
    @staticmethod
    async def upload_user_files(user_id: str, files: List[UploadFile], url_encode_filename = False) -> List[str] | None:
        if user_id is None or len(files) < 1:
            return
        
        upload_dir = "uploads/" + user_id
        os.makedirs(upload_dir, exist_ok=True)
        
        uploaded_files: List[str] = []
        
        for upload_file in files:
            try:
                upload_file_path = upload_dir + "/"
                
                async with aiofiles.open(upload_file_path + upload_file.filename, "wb+") as out_file:
                    while content := await upload_file.read(1024):
                        await out_file.write(content)
                
                await upload_file.close()
                uploaded_files.append(upload_file_path + (upload_file.filename if not url_encode_filename else urllib.parse.quote(upload_file.filename)))
            except Exception:
                continue
        
        if len(uploaded_files) < 1:
            return
        
        return uploaded_files
    
    @staticmethod
    async def cloud_upload_user_files(user_id: str, files: List[UploadFile], background_tasks: BackgroundTasks | None = None) -> List[str] | None:
        if user_id is None or len(files) < 1:
            return
        
        uploaded_files: List[str] = []
        
        for upload_file in files:
            file_name = user_id + "/" + str(uuid.uuid4()) + "-" + upload_file.filename
            blob = StorageService.bucket.blob(file_name)
                
            try:
                image = Image.open(upload_file.file)
                mimetype = Image.MIME[image.format]
                
                await upload_file.seek(0)
                
                if background_tasks is not None:
                    background_tasks.add_task(_upload_image_to_firebase_cloud, blob, upload_file, mimetype)
                else:
                    blob.upload_from_file(upload_file.file, content_type=mimetype)
                    blob.make_public()
                    await upload_file.close()
                
                uploaded_files.append(blob.public_url)
            except Exception:
                continue
        
        if len(uploaded_files) < 1:
            return
        
        return uploaded_files