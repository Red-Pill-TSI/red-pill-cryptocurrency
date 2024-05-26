from pydantic import BaseModel
from datetime import datetime


class User(BaseModel):
    user_id: str | None
    email: str
    is_subscribed: bool | None = False
    added_at: datetime
