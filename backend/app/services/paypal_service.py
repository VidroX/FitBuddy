from pydantic import BaseModel
import requests

from enum import Enum
from app import config
from app.models.enums.string_enum_meta import StringEnumMeta


class OrderStatus(str, Enum, metaclass=StringEnumMeta):
    Created = "CREATED"
    Saved = "SAVED"
    Approved = "APPROVED"
    Voided = "VOIDED"
    Completed = "COMPLETED"
    ActionRequired = "PAYER_ACTION_REQUIRED"


class OrderInfo(BaseModel):
    order_status: OrderStatus
    purchase_price: float


class PayPalService():
    @staticmethod
    def generate_access_token() -> str | None:
        data = {
            "grant_type": "client_credentials"
        }
        
        try:
            request = requests.post(f"{config.PAYPAL_ENDPOINT}/v1/oauth2/token", data=data, auth=(config.PAYPAL_CLIENT_ID, config.PAYPAL_SECRET))
            
            if request is None or request.json() is None:
                return None
            
            response = request.json()
            
            token = response.get("access_token", None)
            
            if token is None or len(token) < 1:
                return None
            
            return token
        except:
            return None
    
    @staticmethod
    def get_order_info(order_id: str) -> OrderInfo | None:
        access_token = PayPalService.generate_access_token()
        
        if access_token is None:
            return None
        
        try:
            request = requests.get(f"{config.PAYPAL_ENDPOINT}/v2/checkout/orders/{order_id}", headers={ "Authorization": f"Bearer {access_token}", "Content-Type": "application/json" })
            
            if request is None or request.json() is None:
                return None
            
            response = request.json()
            
            status = response.get("status", None)
            
            if status is None or len(status) < 1:
                return None
            
            purchase_units = response.get("purchase_units", None)
            
            if purchase_units is None or len(purchase_units) < 1:
                return None
            
            amount = purchase_units[0].get("amount", None)
            
            if amount is None:
                return None
            
            price = amount.get("value", None)
            
            if price is None or len(price) < 1:
                return None
            
            return OrderInfo(
                order_status=OrderStatus(status),
                purchase_price=float(price)
            )
        except:
            return None
    