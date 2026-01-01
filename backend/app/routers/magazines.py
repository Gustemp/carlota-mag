"""
Rotas para gerenciamento de revistas
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.magazine import Magazine
from app.schemas.magazine import MagazineCreate, MagazineUpdate, MagazineResponse

router = APIRouter(prefix="/api/magazines", tags=["magazines"])


@router.get("", response_model=List[MagazineResponse])
def list_magazines(
    published_only: bool = Query(False, description="Filtrar apenas publicadas"),
    db: Session = Depends(get_db)
):
    """Lista todas as revistas"""
    query = db.query(Magazine)
    if published_only:
        query = query.filter(Magazine.is_published == True)
    return query.order_by(desc(Magazine.publish_date), desc(Magazine.created_at)).all()


@router.get("/{magazine_id}", response_model=MagazineResponse)
def get_magazine(magazine_id: str, db: Session = Depends(get_db)):
    """Busca uma revista pelo ID"""
    magazine = db.query(Magazine).filter(Magazine.id == magazine_id).first()
    if not magazine:
        raise HTTPException(status_code=404, detail="Revista não encontrada")
    return magazine


@router.post("", response_model=MagazineResponse, status_code=201)
def create_magazine(magazine: MagazineCreate, db: Session = Depends(get_db)):
    """Cria uma nova revista"""
    db_magazine = Magazine(**magazine.model_dump())
    db.add(db_magazine)
    db.commit()
    db.refresh(db_magazine)
    return db_magazine


@router.put("/{magazine_id}", response_model=MagazineResponse)
def update_magazine(
    magazine_id: str,
    magazine: MagazineUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza uma revista existente"""
    db_magazine = db.query(Magazine).filter(Magazine.id == magazine_id).first()
    if not db_magazine:
        raise HTTPException(status_code=404, detail="Revista não encontrada")
    
    update_data = magazine.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_magazine, field, value)
    
    db.commit()
    db.refresh(db_magazine)
    return db_magazine


@router.delete("/{magazine_id}", status_code=204)
def delete_magazine(magazine_id: str, db: Session = Depends(get_db)):
    """Exclui uma revista"""
    db_magazine = db.query(Magazine).filter(Magazine.id == magazine_id).first()
    if not db_magazine:
        raise HTTPException(status_code=404, detail="Revista não encontrada")
    
    db.delete(db_magazine)
    db.commit()
    return None
