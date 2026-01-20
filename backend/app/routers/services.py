"""
Rotas para gerenciamento de serviços
"""
import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Service
from app.schemas import ServiceCreate, ServiceUpdate, ServiceResponse

router = APIRouter(prefix="/api/services", tags=["services"])


def generate_slug(title: str) -> str:
    """Gera um slug a partir do título"""
    slug = title.lower()
    slug = re.sub(r'[àáâãäå]', 'a', slug)
    slug = re.sub(r'[èéêë]', 'e', slug)
    slug = re.sub(r'[ìíîï]', 'i', slug)
    slug = re.sub(r'[òóôõö]', 'o', slug)
    slug = re.sub(r'[ùúûü]', 'u', slug)
    slug = re.sub(r'[ç]', 'c', slug)
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')


@router.get("", response_model=List[ServiceResponse])
def list_services(active_only: bool = True, db: Session = Depends(get_db)):
    """Lista todos os serviços"""
    query = db.query(Service)
    if active_only:
        query = query.filter(Service.is_active == True)
    return query.order_by(Service.order.asc()).all()


@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(service_id: str, db: Session = Depends(get_db)):
    """Busca um serviço por ID ou slug"""
    service = db.query(Service).filter(
        (Service.id == service_id) | (Service.slug == service_id)
    ).first()
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return service


@router.post("", response_model=ServiceResponse)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    """Cria um novo serviço"""
    slug = service.slug or generate_slug(service.title)
    
    db_service = Service(
        title=service.title,
        slug=slug,
        description=service.description,
        icon=service.icon,
        image=service.image,
        order=service.order,
        is_active=service.is_active
    )
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(service_id: str, service: ServiceUpdate, db: Session = Depends(get_db)):
    """Atualiza um serviço"""
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    update_data = service.model_dump(exclude_unset=True)
    
    if 'title' in update_data and not update_data.get('slug'):
        update_data['slug'] = generate_slug(update_data['title'])
    
    for key, value in update_data.items():
        setattr(db_service, key, value)
    
    db.commit()
    db.refresh(db_service)
    return db_service


@router.delete("/{service_id}")
def delete_service(service_id: str, db: Session = Depends(get_db)):
    """Remove um serviço"""
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    db.delete(db_service)
    db.commit()
    return {"message": "Serviço removido com sucesso"}
