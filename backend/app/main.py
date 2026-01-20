"""
Carlota Mag - API Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import settings
from app.database import engine, Base
from app.routers import magazines_router, upload_router, articles_router, services_router, contacts_router

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Criar pasta de uploads
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.UPLOAD_DIR, "pdfs").mkdir(parents=True, exist_ok=True)
Path(settings.UPLOAD_DIR, "covers").mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="Carlota Mag API",
    description="API para gerenciamento do arquivo digital de revistas",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar pasta de uploads como arquivos estáticos
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Rotas
app.include_router(magazines_router)
app.include_router(upload_router)
app.include_router(articles_router)
app.include_router(services_router)
app.include_router(contacts_router)


@app.get("/")
def root():
    return {"message": "Carlota Mag API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/debug/storage")
def debug_storage():
    return {
        "use_s3": settings.use_s3,
        "use_cloudinary": settings.use_cloudinary,
        "s3_bucket": settings.AWS_S3_BUCKET or "not set",
        "s3_region": settings.AWS_S3_REGION or "not set",
        "has_aws_key": bool(settings.AWS_ACCESS_KEY_ID),
        "has_aws_secret": bool(settings.AWS_SECRET_ACCESS_KEY),
    }
