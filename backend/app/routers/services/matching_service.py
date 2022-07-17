from bson import ObjectId
import geopy.distance

from beanie.operators import Or, And, NE
from typing import List
from fastapi import HTTPException
from app.database.models.activity_model import ActivityModel
from app.database.models.match_model import MatchModel
from app.database.models.user_model import UserModel
from app.helpers.user_helper import UserHelper
from app.models.user import User
from app.routers.models.matches_response import AcceptedRejectedMatches, CoupledUserMatch, Match, MatchWithAcceptance
from app.services.geocoding_service import GeocodingService


COMMON_AGGREGATION_PIPE = [
    {
        "$lookup": {
            "from": "users",
            "localField": "user1",
            "foreignField": "_id",
            "as": "user1",
            "pipeline": [
                {
                    "$lookup": {
                        "from": "activities",
                        "localField": "activities",
                        "foreignField": "_id",
                        "as": "activities"
                    }
                }
            ]
        }
    },
    {
        "$lookup": {
            "from": "users",
            "localField": "user2",
            "foreignField": "_id",
            "as": "user2",
            "pipeline": [
                {
                    "$lookup": {
                        "from": "activities",
                        "localField": "activities",
                        "foreignField": "_id",
                        "as": "activities"
                    }
                }
            ]
        }
    },
    { "$unwind": '$user1' },
    { "$unwind": '$user2' },
]


class MatchingService():
    @staticmethod
    async def get_user_matches(user: User, fetch_pending_matches = False) -> List[Match]:
        existing_matches = And(MatchModel.user1_accepted == True, MatchModel.user2_accepted == True)
        pending_matches = And(
            Or(MatchModel.user1_accepted == None, MatchModel.user2_accepted == None),
            And(
                NE(MatchModel.user1_accepted, False),
                NE(MatchModel.user2_accepted, False)
            )
        )
        
        matches = await MatchModel.find(
            And(
                Or(MatchModel.user1 == user.id, MatchModel.user2 == user.id),
                pending_matches if fetch_pending_matches else existing_matches
            )
        ).aggregate(COMMON_AGGREGATION_PIPE, projection_model=CoupledUserMatch).to_list()
        
        proper_matches: List[Match] = []
        
        for users in matches:
            match = users.user2 if user.id == users.user1.id else users.user1
            
            if match.activities is None or user.activities is None:
                continue
            
            shared_activities = [activity for activity in users.user1.activities if activity in users.user2.activities]
            proper_matches.append(Match(user=match, shared_activities=shared_activities))
        
        return proper_matches
    
    
    @staticmethod
    async def get_user_match(user: User, match: User) -> MatchWithAcceptance | None:
        db_matches = await MatchModel.find(
            And(
                Or(MatchModel.user1 == user.id, MatchModel.user2 == user.id),
                Or(MatchModel.user1 == match.id, MatchModel.user2 == match.id)
            )
        ).aggregate(
            [
                *COMMON_AGGREGATION_PIPE,
                { "$limit": 1 }
            ],
            projection_model=CoupledUserMatch
        ).to_list()
        
        if db_matches is None or len(db_matches) < 1:
            return None
        
        match = db_matches[0].user1 if db_matches[0].user1.id == user.id else db_matches[0].user2
        
        return MatchWithAcceptance(
            match=match,
            user_accepted=db_matches[0].user1_accepted if db_matches[0].user1.id == user.id else db_matches[0].user2_accepted,
            match_accepted=db_matches[0].user1_accepted if db_matches[0].user1.id == match.id else db_matches[0].user2_accepted
        )
    
    @staticmethod
    async def get_accepted_rejected_user_matches(user: User) -> AcceptedRejectedMatches:
        db_matches = await MatchModel.find(Or(MatchModel.user1 == user.id, MatchModel.user2 == user.id)).aggregate(
            [
                *COMMON_AGGREGATION_PIPE
            ],
            projection_model=CoupledUserMatch
        ).to_list()
        
        if db_matches is None or len(db_matches) < 1:
            return AcceptedRejectedMatches(
                accepted=[],
                rejected=[]
            )
        
        accepted_matches: List[User] = []
        rejected_matches: List[User] = []
        
        for coupled_user_match in db_matches:
            match = coupled_user_match.user2 if coupled_user_match.user1.id == user.id else coupled_user_match.user1
            
            is_accepted_match = (coupled_user_match.user1_accepted == True and coupled_user_match.user1.id == user.id) or \
                (coupled_user_match.user2_accepted == True and coupled_user_match.user2.id == user.id)
            
            if is_accepted_match:
                accepted_matches.append(match)
            elif coupled_user_match.user1_accepted == False or coupled_user_match.user2_accepted == False:
                rejected_matches.append(match)
        
        return AcceptedRejectedMatches(
            accepted=accepted_matches,
            rejected=rejected_matches
        )


    @staticmethod
    async def search_filtered_matches(
        user: User,
        address: str | None = None,
        min_distance: int | None = None,
        max_distance: int | None = None,
        activities: List[ActivityModel] | None = None
    ) -> List[Match]:
        if user is None:
            raise HTTPException(status_code=401, detail={"message": "Authorization token is missing or invalid"})
        
        proper_activities = activities if activities is not None else user.activities
        
        users = await UserHelper.get_aggregated_users_from_db()
        
        matches: List[Match] = []
        
        if proper_activities is None:
            return []
        
        for possible_match in users:
            if possible_match.activities is None or possible_match.id == user.id:
                continue
            
            shared_activities = [activity for activity in proper_activities if activity in possible_match.activities]
            
            if len(shared_activities) > 0:
                matches.append(Match(user=possible_match, shared_activities=shared_activities))
        
        filtered_matches: List[Match] | None = None
        accepted_rejected_matches = await MatchingService.get_accepted_rejected_user_matches(user)
        
        matches = list(filter(
            lambda match: 
                not any(filter(lambda accepted: match.match.id == accepted.id, accepted_rejected_matches.accepted)) and \
                not any(filter(lambda rejected: match.match.id == rejected.id, accepted_rejected_matches.rejected)),
            matches
        ))
            
        if address is not None and (min_distance is not None or max_distance is not None):
            filtered_matches = []
            
            coordinates = user.address.coordinates if user.address.name == address else \
                GeocodingService.geocode_address(address)
            
            if coordinates is not None:
                for match in matches:
                    if match.match.address.coordinates is None:
                        continue
                    
                    distance = geopy.distance.geodesic(
                        (coordinates.latitude, coordinates.longitude),
                        (match.match.address.coordinates.latitude, match.match.address.coordinates.longitude)
                    ).km
                    
                    if min_distance is not None and distance >= min_distance and max_distance is not None and distance <= max_distance:
                        filtered_matches.append(match)
                        
        return matches if filtered_matches is None else filtered_matches
    
    @staticmethod
    async def get_possible_match(
        user: User,
        match_id: str,
        activities: List[ActivityModel] | None = None
    ) -> Match | None:
        if user is None or match_id is None or len(match_id) != 24:
            return None
        
        proper_activities = activities if activities is not None else user.activities
        
        possible_match: User = await UserHelper.get_aggregated_user_from_db(UserModel.id, ObjectId(match_id))
        
        if possible_match.activities is None:
            return None
            
        shared_activities = [activity for activity in proper_activities if activity in possible_match.activities]
            
        if len(shared_activities) < 1:
            return None
                        
        return Match(
            user=possible_match,
            shared_activities=shared_activities
        )