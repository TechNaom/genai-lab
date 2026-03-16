"""
Manohar's GenAI Lab — FastAPI Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers import posts, auth, newsletter

app = FastAPI(
    title="Manohar's GenAI Lab API",
    description="Backend API for the GenAI Lab blog platform",
    version="1.0.0"
)

# CORS — allow frontend origin
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    return {"status": "healthy"}
