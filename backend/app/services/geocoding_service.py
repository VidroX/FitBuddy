import requests
import urllib.parse

from app import config
from app.services.types.coordinates import Coordinates


BING_MAPS_API_ENDPOINT = "http://dev.virtualearth.net/REST/v1"

class GeocodingService():
    @staticmethod
    def geocode_address(address: str) -> Coordinates | None:
        encoded_location = urllib.parse.quote_plus(address)
        params = urllib.parse.urlencode({ "key": config.BING_MAPS_API_KEY }, quote_via=urllib.parse.quote_plus)
        
        request = requests.get(f"{BING_MAPS_API_ENDPOINT}/Locations/{encoded_location}?{params}")
        
        if request is None or request.json() is None:
            return None
        
        response = request.json()
        
        resourceSets = response.get("resourceSets", None)
        
        if resourceSets is None or len(resourceSets) < 1:
            return None
        
        resources = resourceSets[0].get("resources", None)
        
        if resources is None or len(resources) < 1:
            return None
        
        point = resources[0].get("point", None)
        
        if point is None:
            return None
        
        coordinates = point.get("coordinates", None)
        
        if coordinates is None or len(coordinates) < 2:
            return None
        
        return Coordinates(x=coordinates[0], y=coordinates[1])