from typing import List, Optional
from pydantic import BaseModel


class PostBase(BaseModel):
    title: str
    slug: Optional[str] = None
    category: Optional[str] = "GenAI Systems"
    tags: Optional[List[str]] = []
    excerpt: Optional[str] = ""
    color: Optional[str] = "cyan"
    status: Optional[str] = "published"
    featured: Optional[bool] = False


class PostCreate(PostBase):
    content: Optional[str] = ""


class PostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    excerpt: Optional[str] = None
    color: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None
    content: Optional[str] = None


class PostListItem(BaseModel):
    title: str
    slug: str
    date: Optional[str] = ""
    category: Optional[str] = ""
    tags: Optional[List[str]] = []
    excerpt: Optional[str] = ""
    color: Optional[str] = "cyan"
    status: Optional[str] = "published"
    featured: Optional[bool] = False
    readTime: Optional[int] = 5

    class Config:
        extra = "allow"


class PostResponse(PostListItem):
    content: Optional[str] = ""
