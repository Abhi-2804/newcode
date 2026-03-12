from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# 1. Dynamically find the path to the backend/ folder
# __file__ is config.py. parent is app/. parent.parent is backend/.
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    DATABASE_URL: str = "sqlite:///./vidyamitra.db"

    # No default value -> fails fast if missing!
    OPENAI_API_KEY: str

    JWT_SECRET_KEY: str = "change-this-secret-key"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours

    # 2. Tell Pydantic exactly where that .env file is
    model_config = SettingsConfigDict(env_file=ENV_PATH, env_file_encoding="utf-8", extra="ignore")


# 3. Instantiate the settings object
settings = Settings()