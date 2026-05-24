from __future__ import annotations

from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "local"
    supabase_url: str = "http://127.0.0.1:54321"
    supabase_jwt_secret: str = "local-dev-secret"
    supabase_service_role_key: Optional[str] = None
    web_origin: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()
