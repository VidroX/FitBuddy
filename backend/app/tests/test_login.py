
import pytest
import json
import requests


def login_url():
    return "http://localhost:8000/api/v1/auth/login"


@pytest.mark.skip(reason="no way of currently testing this")
def test_login_page_open():
    url = "http://localhost:3000/auth/login"
    response = requests.get(url)
    assert response.status_code == 200


# @pytest.mark.skip(reason="no way of currently testing this")
@pytest.mark.skip
@pytest.mark.parametrize("input_credentials, expected",
                         [({"email": "test@example.com", "password": "TEST123#"}, 200),
                          ({"email": "test", "password": "TEST123#"}, 400),
                          ({"email": ".com", "password": "TEST123#"}, 400),
                          ({"email": "@example", "password": "TEST123#"}, 400),
                          ({"email": "", "password": "TEST123#"}, 400),
                          ({"email": "", "password": ""}, 400),
                          ({"email": "", "password": "TEST123#"}, 400),
                          ({"email": "test@example.com", "password": ""}, 400)])
def test_login(input_credentials, expected):

    url = login_url()
    data = input_credentials
    response = requests.post(url, data=data)
    assert response.status_code == expected
