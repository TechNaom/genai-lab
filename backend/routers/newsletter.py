"""
Newsletter router — stores subscribers to disk.
"""
import os
import json
import re
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

def get_subscribers_file() -> Path:
    """Save subscribers.json next to the posts directory."""
    posts_dir = os.getenv("POSTS_DIR", "/data/posts")
    path = Path(posts_dir).parent / "subscribers.json"
    # Ensure parent directory exists
    path.parent.mkdir(parents=True, exist_ok=True)
    return path

class SubscribeRequest(BaseModel):
    email: str

def load_subscribers() -> list:
    f = get_subscribers_file()
    if f.exists():
        try:
            return json.loads(f.read_text())
        except Exception:
            return []
    return []

def save_subscribers(subs: list):
    get_subscribers_file().write_text(json.dumps(subs, indent=2))

@router.post("/subscribe")
def subscribe(req: SubscribeRequest):
    email = req.email.strip().lower()

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise HTTPException(status_code=422, detail="Invalid email address")

    subscribers = load_subscribers()

    if email in subscribers:
        return {"status": "already_subscribed", "message": "You are already subscribed!"}

    subscribers.append(email)
    save_subscribers(subscribers)

    return {"status": "subscribed", "message": "Successfully subscribed!"}

@router.get("/count")
def subscriber_count():
    return {"count": len(load_subscribers())}
