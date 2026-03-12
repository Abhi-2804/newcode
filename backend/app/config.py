from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    DATABASE_URL: str = "sqlite:///./vidyamitra.db"
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    JWT_SECRET_KEY: str = "change-this-secret-key"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours

    class Config:
        env_file = ".env"


settings = Settings()
