"""
Manohar's GenAI Lab — FastAPI Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import posts, auth, newsletter

app = FastAPI(
    title="Manohar's GenAI Lab API",
    description="Backend API for the GenAI Lab blog platform",
    version="1.0.0"
)

# CORS — explicitly allow all origins including Render frontend
origins = [
    "https://genai-lab-frontend.onrender.com",
    "http://genai-lab-frontend.onrender.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Routers
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(newsletter.router, prefix="/api/newsletter", tags=["newsletter"])

@app.get("/")
def root():
    return {"status": "ok", "service": "GenAI Lab API"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "GenAI Lab API"}

@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    """Handle OPTIONS preflight requests explicitly"""
    return {"status": "ok"}
