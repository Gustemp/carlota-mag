"""
Schemas Pydantic para Contact
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class ContactBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    is_read: Optional[bool] = None


class ContactResponse(ContactBase):
    id: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
