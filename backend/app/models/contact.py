"""
Modelo Contact - Representa uma mensagem de contato
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime

from app.database import Base


class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
