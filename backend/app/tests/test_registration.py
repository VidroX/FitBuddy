# test_registration

import pytest
import requests

from bson import ObjectId
from fastapi import UploadFile
from app.database.models.user_model import UserModel


def register_url():
    return "/api/v1/auth/register"


async def create_upload_file(file: UploadFile):
    print(file)
    return {"images": file.filename}



@pytest.mark.skip(reason="no way of currently testing this")
def test_registeration_page_open():
    url = "http://localhost:3000/auth/register"
    response = requests.get(url)
    assert response.status_code == 200


#client = TestClient(app)


@pytest.mark.asyncio
async def test_valid_registration(client):
    url = register_url()

    files = {'images': open("Sunflower_from_Silesia2.jpg", "rb")}

    data = {'firstname': 'test',
            'lastname': 'user',
            'email': 'test_user2@gmail.com',
            'password': 'TEST123#',
            'about': 'asdads',
            'gender': 'M',
            'activities': ["62ce58147f0497ee25cecafd"],
            'address': 'dsfsdfs'}

    response = await client.post(url, data=data, files=files)
    assert response.status_code == 200
        
    user = response.json().get("user", None)
    user_id = user.get("_id", None)
        
    assert user_id is not None
        
    db_user = await UserModel.find_one(UserModel.id == ObjectId(user_id))
    
    assert db_user is not None
    
    await db_user.delete()     
