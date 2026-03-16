"""
Shared pytest fixtures for GenAI Lab backend tests.
"""
import os
import tempfile
import pytest

# Must set env vars before importing app
@pytest.fixture(scope="session", autouse=True)
def set_test_env():
    """Configure environment for testing."""
    temp_posts = tempfile.mkdtemp()
    os.environ.setdefault("POSTS_DIR", temp_posts)
    os.environ.setdefault("ADMIN_SECRET", "test-secret")
    os.environ.setdefault("ADMIN_USERNAME", "admin")
    os.environ.setdefault("ADMIN_PASSWORD", "testpass")
    yield
    # Cleanup temp dir after session
    import shutil
    shutil.rmtree(temp_posts, ignore_errors=True)
