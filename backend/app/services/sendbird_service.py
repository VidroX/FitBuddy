import json
from typing import List
from xmlrpc.client import boolean
import requests

from app import config


SENDBIRD_API_ENDPOINT = f"https://api-{config.SENDBIRD_APP_ID}.sendbird.com/v3"


class SendbirdService():
    @staticmethod
    def create_user(user_id: str, first_name: str, last_name: str, image: str) -> str | None:
        data = {
            "user_id": user_id,
            "nickname": f"{first_name} {last_name}",
            "profile_url": image,
            "issue_access_token": True
        }
        
        try:
            request = requests.post(f"{SENDBIRD_API_ENDPOINT}/users", headers={ "Api-Token": config.SENDBIRD_API_KEY }, json=data)
            
            if request is None or request.json() is None:
                return None
            
            response = request.json()
            
            error = response.get("error", None)
            
            if error is not None and error == True:
                return None
            
            token = response.get("access_token", None)
            
            if token is None or len(token) < 1:
                return None
            
            return token
        except:
            return None

    @staticmethod
    def create_channel(channel_id: str, channel_name: str, user_ids: List[str]) -> boolean:
        data = {
            "user_ids": user_ids,
            "is_distinct": True,
            "channel_url": channel_id,
            "name": channel_name,
            "operator_ids": user_ids,
            "inviter_id": user_ids[0]
        }
        
        try:
            request = requests.post(
                f"{SENDBIRD_API_ENDPOINT}/group_channels",
                headers={ "Api-Token": config.SENDBIRD_API_KEY, 'Content-Type': 'application/json', 'Accept':'application/json' },
                json=data
            )
        
            if request is None or request.json() is None:
                return None
            
            response = request.json()
            
            error = response.get("error", None)
            
            if error is not None and error == True:
                return False
            
            return True
        except:
            return False