"""
Schemas Pydantic para Article
"""
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class ArticleBase(BaseModel):
    title: str
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    publish_date: Optional[date] = None
    is_published: bool = False
    is_featured: bool = False


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    publish_date: Optional[date] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None


class ArticleResponse(ArticleBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
