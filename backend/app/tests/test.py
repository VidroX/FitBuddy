import importlib

from requests import request
from app import config
from app.routers.auth_router import APIRouter, router
from fastapi.testclient import TestClient
from app.main import app
import requests


client = TestClient(router)
print(client)


""" def test_read_main():
    url = "http://localhost:8000/api/v1/auth/register"
    filename = "Sunflower_from_Silesia2.jpg"
    data = {'firstName': 'test', 'lastName': 'user', 'email': 'test_user@gmail.com', 'password': 'TEST123#',
            'about': 'asdads', 'images': {"file": ("images", open(filename, "rb"), "image/jpeg")}, 'gender': 'Male', 'address': 'dsfsdfs'}
    response = requests.post(url, data=data)
    assert response.status_code == 200
    #assert response.json() == {"msg": "Hello World"}


 """


def test_abc():

    response = client.get(
        "/register/", headers={"X-Token": "N!CroP70k_BIJLyesa8ifRIcR15ogIwro"})
    assert response.status_code == 200
