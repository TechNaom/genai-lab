"""
Auth router — simple token-based admin authentication.
For production, replace with JWT + hashed passwords.
"""
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "genai2025")
ADMIN_SECRET = os.getenv("ADMIN_SECRET", "genai2025")


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    username: str


@router.post("/login", response_model=LoginResponse)
def login(creds: LoginRequest):
    if creds.username != ADMIN_USERNAME or creds.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # In production: return a signed JWT
    return LoginResponse(token=ADMIN_SECRET, username=creds.username)


@router.post("/verify")
def verify(token: str):
    if token != ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"valid": True}
