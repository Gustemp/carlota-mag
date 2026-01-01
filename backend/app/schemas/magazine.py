"""
Schemas Pydantic para Magazine
"""
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class MagazineBase(BaseModel):
    title: str
    edition: Optional[str] = None
    description: Optional[str] = None
    pdf_url: Optional[str] = None
    cover_image: Optional[str] = None
    publish_date: Optional[date] = None
    is_published: bool = True


class MagazineCreate(MagazineBase):
    pass


class MagazineUpdate(BaseModel):
    title: Optional[str] = None
    edition: Optional[str] = None
    description: Optional[str] = None
    pdf_url: Optional[str] = None
    cover_image: Optional[str] = None
    publish_date: Optional[date] = None
    is_published: Optional[bool] = None


class MagazineResponse(MagazineBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
