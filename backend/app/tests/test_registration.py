# test_registration

import pytest
import json
import requests


def url():
    return "http://localhost:8000/api/v1/auth/register"


@pytest.mark.skip(reason="no way of currently testing this")
def test_registeration_page_open():
    url = "http://localhost:3000/auth/register"
    response = requests.get(url)
    assert response.status_code == 200


def test_valid_registration():
    url = url()
    data = {'firstName': '', 'lastName': '', 'email': '', 'password': '',
            'about': '', 'images': '', 'activities': '', 'gender': '', 'address': ''}
    response = requests.get(url, data=data)
    assert response.status_code == 200
