"""
Posts router — CRUD for markdown blog posts.
Posts are stored as .md files in the /posts directory.
Frontmatter is YAML between --- delimiters.
"""
import os
import re
import math
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Depends, Header
from models.post import PostCreate, PostUpdate, PostResponse, PostListItem
from utils.markdown import parse_frontmatter, write_post, slugify

router = APIRouter()

POSTS_DIR = os.getenv("POSTS_DIR", os.path.join(os.path.dirname(__file__), "../../posts"))
ADMIN_SECRET = os.getenv("ADMIN_SECRET", "genai2025")


def verify_admin(x_admin_token: Optional[str] = Header(None)):
    if x_admin_token != ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


def get_posts_dir() -> str:
    path = os.path.abspath(POSTS_DIR)
    os.makedirs(path, exist_ok=True)
    return path


def estimate_reading_time(content: str) -> int:
    words = len(content.split())
    return max(1, math.ceil(words / 200))


def load_post_file(filepath: str) -> dict:
    with open(filepath, "r", encoding="utf-8") as f:
        raw = f.read()
    meta, content = parse_frontmatter(raw)
    meta["content"] = content
    meta["readTime"] = estimate_reading_time(content)
    return meta


# ── List all published posts ──────────────────────────────────────────────────

@router.get("/", response_model=List[PostListItem])
def list_posts(
    tag: Optional[str] = None,
    category: Optional[str] = None,
    q: Optional[str] = None,
    status: Optional[str] = "published",
    page: int = 1,
    limit: int = 20,
):
    posts_dir = get_posts_dir()
    posts = []

    for filename in os.listdir(posts_dir):
        if not filename.endswith(".md"):
            continue
        filepath = os.path.join(posts_dir, filename)
        try:
            meta = load_post_file(filepath)
        except Exception:
            continue

        # Filter by status
        if status and meta.get("status", "published") != status:
            continue

        # Filter by tag
        if tag and tag not in meta.get("tags", []):
            continue

        # Filter by category
        if category and meta.get("category", "") != category:
            continue

        # Full-text search
        if q:
            q_lower = q.lower()
            searchable = f"{meta.get('title','')} {meta.get('excerpt','')} {' '.join(meta.get('tags',[]))}"
            if q_lower not in searchable.lower():
                continue

        posts.append(meta)

    # Sort by date descending
    posts.sort(key=lambda p: p.get("date", "1970-01-01"), reverse=True)

    # Paginate
    start = (page - 1) * limit
    return posts[start: start + limit]


# ── Get single post by slug ───────────────────────────────────────────────────

@router.get("/{slug}", response_model=PostResponse)
def get_post(slug: str):
    posts_dir = get_posts_dir()
    filepath = os.path.join(posts_dir, f"{slug}.md")

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Post not found")

    meta = load_post_file(filepath)

    if meta.get("status") == "draft":
        raise HTTPException(status_code=404, detail="Post not found")

    return meta


# ── Create new post (admin) ───────────────────────────────────────────────────

@router.post("/", response_model=PostResponse, status_code=201)
def create_post(post: PostCreate, _: bool = Depends(verify_admin)):
    posts_dir = get_posts_dir()
    slug = post.slug or slugify(post.title)

    filepath = os.path.join(posts_dir, f"{slug}.md")
    if os.path.exists(filepath):
        raise HTTPException(status_code=409, detail="Post with this slug already exists")

    now = datetime.utcnow().strftime("%Y-%m-%d")
    frontmatter = {
        "title": post.title,
        "slug": slug,
        "date": now,
        "category": post.category,
        "tags": post.tags or [],
        "excerpt": post.excerpt or "",
        "color": post.color or "cyan",
        "status": post.status or "published",
        "featured": post.featured or False,
        "coverImage": post.coverImage or "",
    }

    write_post(filepath, frontmatter, post.content or "")

    result = load_post_file(filepath)
    return result


# ── Update existing post (admin) ──────────────────────────────────────────────

@router.put("/{slug}", response_model=PostResponse)
def update_post(slug: str, post: PostUpdate, _: bool = Depends(verify_admin)):
    posts_dir = get_posts_dir()
    filepath = os.path.join(posts_dir, f"{slug}.md")

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Post not found")

    existing = load_post_file(filepath)

    # Merge updates
    updated = {**existing}
    for field, value in post.dict(exclude_unset=True, exclude={"content"}).items():
        if value is not None:
            updated[field] = value

    content = post.content if post.content is not None else existing.get("content", "")

    # Handle slug rename
    new_slug = post.slug or slug
    if new_slug != slug:
        new_filepath = os.path.join(posts_dir, f"{new_slug}.md")
        os.remove(filepath)
        filepath = new_filepath
        updated["slug"] = new_slug

    write_post(filepath, updated, content)
    return load_post_file(filepath)


# ── Delete post (admin) ───────────────────────────────────────────────────────

@router.delete("/{slug}", status_code=204)
def delete_post(slug: str, _: bool = Depends(verify_admin)):
    posts_dir = get_posts_dir()
    filepath = os.path.join(posts_dir, f"{slug}.md")

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Post not found")

    os.remove(filepath)
    return None


# ── Admin: list all posts including drafts ────────────────────────────────────

@router.get("/admin/all", response_model=List[PostListItem])
def admin_list_all(_: bool = Depends(verify_admin)):
    posts_dir = get_posts_dir()
    posts = []

    for filename in os.listdir(posts_dir):
        if not filename.endswith(".md"):
            continue
        filepath = os.path.join(posts_dir, filename)
        try:
            meta = load_post_file(filepath)
            posts.append(meta)
        except Exception:
            continue

    posts.sort(key=lambda p: p.get("date", "1970-01-01"), reverse=True)
    return posts
