"""
Configurações do aplicativo
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./carlota_mag.db"
    UPLOAD_DIR: str = "uploads"
    MAX_PDF_SIZE_MB: int = 200
    MAX_IMAGE_SIZE_MB: int = 5
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,https://*.netlify.app"
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    @property
    def use_cloudinary(self) -> bool:
        return bool(self.CLOUDINARY_CLOUD_NAME and self.CLOUDINARY_API_KEY and self.CLOUDINARY_API_SECRET)
    
    class Config:
        env_file = ".env"


settings = Settings()
