"""
Tests for the GenAI Lab API.
Run with: pytest backend/tests/ -v
"""
import os
import tempfile
import pytest
from fastapi.testclient import TestClient

# Point to a temp directory for posts during tests
os.environ["POSTS_DIR"] = tempfile.mkdtemp()
os.environ["ADMIN_SECRET"] = "test-secret"
os.environ["ADMIN_USERNAME"] = "admin"
os.environ["ADMIN_PASSWORD"] = "testpass"

from main import app  # noqa: E402  (must import after env setup)

client = TestClient(app)
AUTH_HEADERS = {"x-admin-token": "test-secret"}


# ── Health ──────────────────────────────────────────────────────────────────

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


# ── Auth ────────────────────────────────────────────────────────────────────

def test_login_success():
    res = client.post("/api/auth/login", json={"username": "admin", "password": "testpass"})
    assert res.status_code == 200
    assert "token" in res.json()


def test_login_failure():
    res = client.post("/api/auth/login", json={"username": "admin", "password": "wrong"})
    assert res.status_code == 401


# ── Posts ────────────────────────────────────────────────────────────────────

def test_list_posts_empty():
    res = client.get("/api/posts/")
    assert res.status_code == 200
    assert res.json() == []


def test_create_post():
    payload = {
        "title": "Test Article",
        "slug": "test-article",
        "category": "AI Automation",
        "tags": ["test", "automation"],
        "excerpt": "A test article",
        "content": "## Hello\n\nThis is a test article with some content.",
        "color": "cyan",
        "status": "published",
    }
    res = client.post("/api/posts/", json=payload, headers=AUTH_HEADERS)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Test Article"
    assert data["slug"] == "test-article"
    assert data["status"] == "published"
    assert data["readTime"] >= 1


def test_get_post():
    res = client.get("/api/posts/test-article")
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Test Article"
    assert "## Hello" in data["content"]


def test_list_posts_returns_published():
    res = client.get("/api/posts/")
    assert res.status_code == 200
    posts = res.json()
    assert len(posts) == 1
    assert posts[0]["slug"] == "test-article"


def test_update_post():
    res = client.put(
        "/api/posts/test-article",
        json={"excerpt": "Updated excerpt", "color": "purple"},
        headers=AUTH_HEADERS,
    )
    assert res.status_code == 200
    assert res.json()["excerpt"] == "Updated excerpt"
    assert res.json()["color"] == "purple"


def test_create_duplicate_slug_fails():
    payload = {"title": "Another Test", "slug": "test-article", "content": "dup"}
    res = client.post("/api/posts/", json=payload, headers=AUTH_HEADERS)
    assert res.status_code == 409


def test_unauthorized_create():
    payload = {"title": "Sneaky Post", "content": "hacker"}
    res = client.post("/api/posts/", json=payload)
    assert res.status_code == 401


def test_draft_not_visible_publicly():
    # Create a draft
    client.post(
        "/api/posts/",
        json={"title": "Draft Post", "slug": "draft-post", "content": "draft", "status": "draft"},
        headers=AUTH_HEADERS,
    )
    # Public listing should not include it
    res = client.get("/api/posts/")
    slugs = [p["slug"] for p in res.json()]
    assert "draft-post" not in slugs

    # Admin listing should include it
    res = client.get("/api/posts/admin/all", headers=AUTH_HEADERS)
    slugs = [p["slug"] for p in res.json()]
    assert "draft-post" in slugs


def test_search_posts():
    res = client.get("/api/posts/?q=test")
    assert res.status_code == 200
    assert len(res.json()) >= 1


def test_delete_post():
    res = client.delete("/api/posts/test-article", headers=AUTH_HEADERS)
    assert res.status_code == 204

    res = client.get("/api/posts/test-article")
    assert res.status_code == 404


def test_get_nonexistent_post():
    res = client.get("/api/posts/does-not-exist")
    assert res.status_code == 404
