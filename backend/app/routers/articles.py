"""
Rotas para gerenciamento de artigos/notícias
"""
import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Article
from app.schemas import ArticleCreate, ArticleUpdate, ArticleResponse

router = APIRouter(prefix="/api/articles", tags=["articles"])


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


@router.get("", response_model=List[ArticleResponse])
def list_articles(published_only: bool = True, db: Session = Depends(get_db)):
    """Lista todos os artigos"""
    query = db.query(Article)
    if published_only:
        query = query.filter(Article.is_published == True)
    return query.order_by(Article.publish_date.desc()).all()


@router.get("/featured", response_model=List[ArticleResponse])
def list_featured_articles(db: Session = Depends(get_db)):
    """Lista artigos em destaque"""
    return db.query(Article).filter(
        Article.is_published == True,
        Article.is_featured == True
    ).order_by(Article.publish_date.desc()).limit(5).all()


@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: str, db: Session = Depends(get_db)):
    """Busca um artigo por ID ou slug"""
    article = db.query(Article).filter(
        (Article.id == article_id) | (Article.slug == article_id)
    ).first()
    if not article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    return article


@router.post("", response_model=ArticleResponse)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    """Cria um novo artigo"""
    slug = article.slug or generate_slug(article.title)
    
    existing = db.query(Article).filter(Article.slug == slug).first()
    if existing:
        slug = f"{slug}-{existing.id[:8]}"
    
    db_article = Article(
        title=article.title,
        slug=slug,
        excerpt=article.excerpt,
        content=article.content,
        cover_image=article.cover_image,
        category=article.category,
        author=article.author,
        publish_date=article.publish_date,
        is_published=article.is_published,
        is_featured=article.is_featured
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


@router.put("/{article_id}", response_model=ArticleResponse)
def update_article(article_id: str, article: ArticleUpdate, db: Session = Depends(get_db)):
    """Atualiza um artigo"""
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    
    update_data = article.model_dump(exclude_unset=True)
    
    if 'title' in update_data and not update_data.get('slug'):
        update_data['slug'] = generate_slug(update_data['title'])
    
    for key, value in update_data.items():
        setattr(db_article, key, value)
    
    db.commit()
    db.refresh(db_article)
    return db_article


@router.delete("/{article_id}")
def delete_article(article_id: str, db: Session = Depends(get_db)):
    """Remove um artigo"""
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    
    db.delete(db_article)
    db.commit()
    return {"message": "Artigo removido com sucesso"}
