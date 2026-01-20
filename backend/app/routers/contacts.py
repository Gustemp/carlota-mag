"""
Rotas para gerenciamento de contatos
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Contact
from app.schemas import ContactCreate, ContactUpdate, ContactResponse

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


@router.get("", response_model=List[ContactResponse])
def list_contacts(unread_only: bool = False, db: Session = Depends(get_db)):
    """Lista todas as mensagens de contato"""
    query = db.query(Contact)
    if unread_only:
        query = query.filter(Contact.is_read == False)
    return query.order_by(Contact.created_at.desc()).all()


@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(contact_id: str, db: Session = Depends(get_db)):
    """Busca uma mensagem de contato por ID"""
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    return contact


@router.post("", response_model=ContactResponse)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    """Cria uma nova mensagem de contato"""
    db_contact = Contact(
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        subject=contact.subject,
        message=contact.message
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(contact_id: str, contact: ContactUpdate, db: Session = Depends(get_db)):
    """Atualiza uma mensagem de contato (marcar como lida)"""
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    
    update_data = contact.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_contact, key, value)
    
    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.delete("/{contact_id}")
def delete_contact(contact_id: str, db: Session = Depends(get_db)):
    """Remove uma mensagem de contato"""
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    
    db.delete(db_contact)
    db.commit()
    return {"message": "Mensagem removida com sucesso"}
