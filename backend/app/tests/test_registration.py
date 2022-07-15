# test_registration

from ast import List
import base64
from anyio import Path
import pytest
import json
import pytest_asyncio
import requests
from fastapi import UploadFile
import asyncio
import pytest_asyncio
from app.routers.auth_router import routers


def register_url():
    return "http://localhost:8000/api/v1/auth/register"


async def create_upload_file(file: UploadFile):
    print(file)
    return {"images": file.filename}


@pytest.mark.skip(reason="no way of currently testing this")
def test_registeration_page_open():
    url = "http://localhost:3000/auth/register"
    response = requests.get(url)
    assert response.status_code == 200


# 'activities': [{'name': "Football"}],

async def test_valid_registration():
    url = register_url()
   # _test_upload_file = Path('Sunflower_from_Silesia2.jpg')
   # _files = {'images': _test_upload_file.open('rb')}
    _test_upload_file = Path('app\tests', 'Sunflower_from_Silesia2.jpg')
    _files = {'upload_file': _test_upload_file.open('rb')}
    #filename = "Sunflower_from_Silesia2.jpg"
    filename2 = await create_upload_file(_files)
    # print(filename2)
    """with open(filename, "rb") as f:
        im_bytes = f.read()
    im_b64 = base64.b64encode(im_bytes).decode("utf8")"""

    files = {'images': (_files, 'multipart/form-data', {'Expires': '0'})}
    data = {'firstname': 'test',
            'lastname': 'user',
            'email': 'test_user@gmail.com',
            'password': 'TEST123#',
            'about': 'asdads',
            'gender': 'Male',
            "activities": List(
                {
                    "_id": "62ce58147f0497ee25cecafd",
                    "name": "Football",
                    "image": "https://objectstorage.ca-toronto-1.oraclecloud.com/n/yzoqsirpqezv/b/fitbuddy-bucket/o/football.svg"
                }
            ),
            'address': 'dsfsdfs', }
    # 'images': _files}

    # 'images': _files}
    response = requests.post(url, data=data, files=_files)
    assert response.status_code == 200
