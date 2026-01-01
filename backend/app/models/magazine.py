"""
Modelo Magazine - Representa uma edição de revista
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Date, Boolean, DateTime
from app.database import Base


class Magazine(Base):
    __tablename__ = "magazines"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    edition = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    pdf_url = Column(String(500), nullable=True)
    cover_image = Column(String(500), nullable=True)
    publish_date = Column(Date, nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
