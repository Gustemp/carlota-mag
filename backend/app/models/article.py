"""
Modelo Article - Representa um artigo/notícia
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Date, Boolean, DateTime

from app.database import Base


class Article(Base):
    __tablename__ = "articles"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    cover_image = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)
    author = Column(String(100), nullable=True)
    publish_date = Column(Date, nullable=True)
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
