from beanie import Document, Indexed


class ActivityModel(Document):
    name: Indexed(str, unique=True)
    image: str
    
    class Settings:
        name = "activities"
        use_state_management = True