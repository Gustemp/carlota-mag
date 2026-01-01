"""
Rotas para upload de arquivos
"""
import os
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.config import settings

router = APIRouter(prefix="/api/upload", tags=["upload"])

ALLOWED_PDF_EXTENSIONS = {".pdf"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def get_upload_path(subfolder: str) -> Path:
    """Retorna o caminho da pasta de upload"""
    path = Path(settings.UPLOAD_DIR) / subfolder
    path.mkdir(parents=True, exist_ok=True)
    return path


def validate_file_size(file: UploadFile, max_size_mb: int):
    """Valida o tamanho do arquivo"""
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    
    max_size_bytes = max_size_mb * 1024 * 1024
    if size > max_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"Arquivo muito grande. Máximo permitido: {max_size_mb}MB"
        )


def get_safe_filename(original_filename: str) -> str:
    """Gera um nome de arquivo seguro com UUID"""
    ext = Path(original_filename).suffix.lower()
    unique_id = str(uuid.uuid4())[:8]
    safe_name = "".join(c for c in Path(original_filename).stem if c.isalnum() or c in "-_")
    return f"{unique_id}_{safe_name}{ext}"


@router.post("/pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload de arquivo PDF"""
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_PDF_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Tipo de arquivo não permitido. Apenas PDF é aceito."
        )
    
    validate_file_size(file, settings.MAX_PDF_SIZE_MB)
    
    upload_path = get_upload_path("pdfs")
    filename = get_safe_filename(file.filename)
    file_path = upload_path / filename
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    return {"file_url": f"/uploads/pdfs/{filename}"}


@router.post("/cover")
async def upload_cover(file: UploadFile = File(...)):
    """Upload de imagem de capa"""
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Tipo de arquivo não permitido. Apenas JPG, PNG e WebP são aceitos."
        )
    
    validate_file_size(file, settings.MAX_IMAGE_SIZE_MB)
    
    upload_path = get_upload_path("covers")
    filename = get_safe_filename(file.filename)
    file_path = upload_path / filename
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    return {"file_url": f"/uploads/covers/{filename}"}
