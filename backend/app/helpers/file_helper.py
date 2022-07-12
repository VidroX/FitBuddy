import os
import aiofiles

from typing import List
from fastapi import UploadFile


class FileHelper():
    @staticmethod
    async def upload_user_files(user_id: str, files: List[UploadFile]) -> List[str] | None:
        if user_id is None or len(files) < 1:
            return
        
        upload_dir = "uploads/" + user_id
        os.makedirs(upload_dir, exist_ok=True)
        
        uploaded_files: List[str] = []
        
        for upload_file in files:
            try:
                upload_file_path = upload_dir + "/" + upload_file.filename
                
                async with aiofiles.open(upload_file_path, "wb+") as out_file:
                    while content := await upload_file.read(1024):
                        await out_file.write(content)
                
                await upload_file.close()
                uploaded_files.append(upload_file_path)
            except Exception:
                continue
        
        if len(uploaded_files) < 1:
            return
        
        return uploaded_files