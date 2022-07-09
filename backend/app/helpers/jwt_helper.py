from datetime import datetime, timedelta, timezone
from typing import Any, Dict
import jwt

from app import config


class JWTHelper():
    @staticmethod
    def encode_token(additional_payload: Dict[str, Any], is_refresh = False) -> str | None:
        if not config.JWT_SECRET or len(config.JWT_SECRET) < 1:
            return None
        
        issue_time = datetime.now(tz=timezone.utc)
        
        delta = timedelta(minutes=15) if not is_refresh else timedelta(hours=2)
        expiry_time = issue_time + delta
        
        payload = {
            "iss": config.JWT_ISSUER,
            "exp": expiry_time.timestamp(),
            "iat": issue_time.timestamp(),
            "type": "refresh" if is_refresh else "access",
            **additional_payload
        }
            
        try:
            return jwt.encode(payload, config.JWT_SECRET, algorithm="HS256")
        except Exception:
            return None
    
    @staticmethod
    def encode_user_token(user_id: str, is_refresh = False) -> str | None:
        if user_id is None or len(user_id) < 1:
            return None
        
        return JWTHelper.encode_token({ "sub": user_id }, is_refresh)
    
    @staticmethod
    def decode_token(token: str) -> Dict[str, Any] | None:
        if not config.JWT_SECRET or len(config.JWT_SECRET) < 1 or not token:
            return None
            
        try:
            return jwt.decode(token, config.JWT_SECRET, issuer=config.JWT_ISSUER, algorithms=["HS256"])
        except Exception:
            return None