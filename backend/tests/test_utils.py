"""
Unit tests for markdown utilities.
"""
import os
import tempfile
import pytest

# Set env before any app imports
os.environ.setdefault("POSTS_DIR", tempfile.mkdtemp())
os.environ.setdefault("ADMIN_SECRET", "test-secret")

from utils.markdown import parse_frontmatter, write_post, slugify


class TestParseFrontmatter:
    def test_basic_frontmatter(self):
        raw = "---\ntitle: Hello\nslug: hello\n---\n\nContent here."
        meta, content = parse_frontmatter(raw)
        assert meta["title"] == "Hello"
        assert meta["slug"] == "hello"
        assert content == "Content here."

    def test_list_tags(self):
        raw = "---\ntitle: T\ntags:\n  - RAG\n  - LLM\n---\n\nBody."
        meta, content = parse_frontmatter(raw)
        assert meta["tags"] == ["RAG", "LLM"]

    def test_no_frontmatter(self):
        raw = "Just plain content."
        meta, content = parse_frontmatter(raw)
        assert meta == {}
        assert content == "Just plain content."

    def test_empty_frontmatter(self):
        raw = "---\n---\n\nContent."
        meta, content = parse_frontmatter(raw)
        assert isinstance(meta, dict)

    def test_boolean_featured(self):
        raw = "---\nfeatured: true\n---\n\nContent."
        meta, _ = parse_frontmatter(raw)
        assert meta["featured"] is True


class TestWritePost:
    def test_roundtrip(self, tmp_path):
        filepath = str(tmp_path / "test.md")
        frontmatter = {
            "title": "Test Post",
            "slug": "test-post",
            "tags": ["A", "B"],
            "status": "published",
        }
        content = "## Hello\n\nWorld."
        write_post(filepath, frontmatter, content)

        meta, body = parse_frontmatter(open(filepath).read())
        assert meta["title"] == "Test Post"
        assert meta["tags"] == ["A", "B"]
        assert "## Hello" in body

    def test_creates_file(self, tmp_path):
        filepath = str(tmp_path / "new.md")
        write_post(filepath, {"title": "X"}, "Content")
        assert os.path.exists(filepath)


class TestSlugify:
    def test_basic(self):
        assert slugify("Hello World") == "hello-world"

    def test_special_chars(self):
        assert slugify("RAG: A Deep Dive!") == "rag-a-deep-dive"

    def test_multiple_spaces(self):
        assert slugify("Too   Many   Spaces") == "too-many-spaces"

    def test_already_slug(self):
        assert slugify("already-a-slug") == "already-a-slug"

    def test_numbers(self):
        assert slugify("Top 5 LLMs for 2025") == "top-5-llms-for-2025"

    def test_empty(self):
        assert slugify("") == ""
