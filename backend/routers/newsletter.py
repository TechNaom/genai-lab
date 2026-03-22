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
    """Find a writable location for subscribers.json"""
    # Try multiple locations in order
    candidates = [
        Path(os.getenv("POSTS_DIR", "/data/posts")).parent / "subscribers.json",
        Path("/data/subscribers.json"),
        Path("/tmp/subscribers.json"),
    ]
    for path in candidates:
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            # Test if writable
            test = path.parent / ".write_test"
            test.write_text("test")
            test.unlink()
            return path
        except Exception:
            continue
    # Final fallback
    return Path("/tmp/subscribers.json")

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
    f = get_subscribers_file()
    try:
        f.write_text(json.dumps(subs, indent=2))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save subscriber: {str(e)}")

@router.post("/subscribe")
def subscribe(req: SubscribeRequest):
    email = req.email.strip().lower()

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise HTTPException(status_code=422, detail="Invalid email address")

    try:
        subscribers = load_subscribers()

        if email in subscribers:
            return {"status": "already_subscribed", "message": "You are already subscribed!"}

        subscribers.append(email)
        save_subscribers(subscribers)

        return {"status": "subscribed", "message": "Successfully subscribed!"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Subscription error: {str(e)}")

@router.get("/count")
def subscriber_count():
    return {"count": len(load_subscribers())}
