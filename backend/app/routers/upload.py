"""
Rotas para upload de arquivos
"""
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
import cloudinary
import cloudinary.uploader
import boto3
from botocore.exceptions import ClientError
from app.config import settings

router = APIRouter(prefix="/api/upload", tags=["upload"])

ALLOWED_PDF_EXTENSIONS = {".pdf"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Configurar Cloudinary
if settings.use_cloudinary:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET
    )

# Configurar AWS S3
s3_client = None
if settings.use_s3:
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION
    )


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


async def upload_to_cloudinary(file: UploadFile, resource_type: str = "auto", folder: str = "carlota-mag"):
    """Upload arquivo para Cloudinary"""
    try:
        content = await file.read()
        result = cloudinary.uploader.upload(
            content,
            resource_type=resource_type,
            folder=folder,
            public_id=get_safe_filename(file.filename).rsplit('.', 1)[0]
        )
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no upload: {str(e)}")


async def upload_to_s3(file: UploadFile, folder: str = "uploads"):
    """Upload arquivo para AWS S3"""
    try:
        content = await file.read()
        filename = get_safe_filename(file.filename)
        key = f"{folder}/{filename}"
        
        content_type = "application/pdf" if filename.endswith(".pdf") else "image/jpeg"
        if filename.endswith(".png"):
            content_type = "image/png"
        elif filename.endswith(".webp"):
            content_type = "image/webp"
        
        s3_client.put_object(
            Bucket=settings.AWS_S3_BUCKET,
            Key=key,
            Body=content,
            ContentType=content_type
        )
        
        url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_S3_REGION}.amazonaws.com/{key}"
        return url
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Erro no upload S3: {str(e)}")


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
    
    # Prioridade: S3 > Cloudinary > Local
    if settings.use_s3:
        file_url = await upload_to_s3(file, folder="pdfs")
        return {"file_url": file_url}
    
    if settings.use_cloudinary:
        file_url = await upload_to_cloudinary(file, resource_type="raw", folder="carlota-mag/pdfs")
        return {"file_url": file_url}
    
    # Fallback para upload local
    upload_path = get_upload_path("pdfs")
    filename = get_safe_filename(file.filename)
    file_path = upload_path / filename
    
    content = await file.read()
    with open(file_path, "wb") as f:
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
    
    # Prioridade: S3 > Cloudinary > Local
    if settings.use_s3:
        file_url = await upload_to_s3(file, folder="covers")
        return {"file_url": file_url}
    
    if settings.use_cloudinary:
        file_url = await upload_to_cloudinary(file, resource_type="image", folder="carlota-mag/covers")
        return {"file_url": file_url}
    
    # Fallback para upload local
    upload_path = get_upload_path("covers")
    filename = get_safe_filename(file.filename)
    file_path = upload_path / filename
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    return {"file_url": f"/uploads/covers/{filename}"}
