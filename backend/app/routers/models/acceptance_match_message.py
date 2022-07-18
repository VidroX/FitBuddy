from app.routers.models.match_message import MatchMessage


class AcceptanceMatchMessage(MatchMessage):
    is_mutually_accepted: bool