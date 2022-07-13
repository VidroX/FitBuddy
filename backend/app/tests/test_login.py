import pytest
import json
import requests


def test_valid_login(url):
    url = "http://localhost:3000/auth/login"
    data = {'email': 'test@example.com', 'password': 'TEST123#'}

    response = requests.get(url, data=data)

    assert response.status_code == 200
