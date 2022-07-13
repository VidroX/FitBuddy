# test_registration

import pytest
import json
import requests


def url():
    return ""


def test_valid_registration():
    url = url()
    data = {'firstName': '', 'lastName': '', 'email': '', 'password': '',
            'about': '', 'images': '', 'activities': '', 'gender': '', 'address': ''}
    response = requests.get(url, data=data)
    assert response.status_code == 200
