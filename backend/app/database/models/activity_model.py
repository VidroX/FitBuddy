from beanie import Document


class ActivityModel(Document):
    name: str
    image: str
    
    class Settings:
        name = "activities"
        use_state_management = True