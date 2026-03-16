"""
Newsletter router — stores subscribers and optionally syncs to an email provider.
Replace the stub with your Mailchimp / ConvertKit / Resend integration.
"""
import os
import json
import re
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()

SUBSCRIBERS_FILE = Path(os.getenv("POSTS_DIR", "../posts")).parent / "subscribers.json"


class SubscribeRequest(BaseModel):
    email: str


def load_subscribers() -> list[str]:
    if SUBSCRIBERS_FILE.exists():
        return json.loads(SUBSCRIBERS_FILE.read_text())
    return []


def save_subscribers(subs: list[str]):
    SUBSCRIBERS_FILE.write_text(json.dumps(subs, indent=2))


@router.post("/subscribe")
def subscribe(req: SubscribeRequest):
    email = req.email.strip().lower()

    # Basic email validation
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise HTTPException(status_code=422, detail="Invalid email address")

    subscribers = load_subscribers()

    if email in subscribers:
        return {"status": "already_subscribed"}

    subscribers.append(email)
    save_subscribers(subscribers)

    # TODO: Sync to your email provider
    # Example with Resend:
    # import resend
    # resend.api_key = os.getenv("RESEND_API_KEY")
    # resend.Contacts.create({"email": email, "audience_id": os.getenv("RESEND_AUDIENCE_ID")})

    return {"status": "subscribed", "email": email}


@router.get("/count")
def subscriber_count():
    """Public endpoint showing subscriber count."""
    return {"count": len(load_subscribers())}
