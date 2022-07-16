# test_registration

import io
import logging
from pyparsing import Literal
import pytest
import json
import requests
from fastapi import UploadFile
import pytest_asyncio
from app.main import app
from fastapi.testclient import TestClient
import os


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


async def test_valid_registration():
    with TestClient(app) as client:

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

        response = client.post(url, data=data, files=files)
        assert response.status_code == 200
