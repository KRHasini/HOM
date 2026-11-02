"""Application settings, loaded once from environment variables.

Every variable is documented in the repository's ``.env.example``.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

Environment = Literal["development", "test", "production"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # --- runtime -------------------------------------------------------------
    environment: Environment = "development"
    log_level: str = "INFO"
    log_json: bool = True

    # --- database ------------------------------------------------------------
    database_url: str = "postgresql+asyncpg://hom:hom@localhost:5432/hom"
    db_pool_size: int = 5
    db_max_overflow: int = 5
    db_echo: bool = False

    # --- http ----------------------------------------------------------------
    web_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:3000"]
    )
    trust_proxy_headers: bool = False

    # --- security / anti-spam -----------------------------------------------
    ip_hash_secret: SecretStr = SecretStr("dev-only-change-me")
    form_token_secret: SecretStr = SecretStr("dev-only-change-me-too")
    form_min_seconds: float = 2.0
    form_token_max_age_seconds: int = 60 * 60 * 24
    lead_rate_limit: int = 5
    lead_rate_window_seconds: int = 600
    turnstile_enabled: bool = False
    turnstile_secret_key: SecretStr = SecretStr("")

    # --- notifications -------------------------------------------------------
    mail_backend: Literal["console", "smtp"] = "console"
    mail_from: str = "House of Movements <no-reply@houseofmovements.in>"
    studio_notify_email: str = "hello@houseofmovements.in"
    send_visitor_confirmation: bool = False
    smtp_host: str = "localhost"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: SecretStr = SecretStr("")
    smtp_starttls: bool = True
    smtp_ssl: bool = False
    smtp_timeout_seconds: float = 10.0

    # --- studio facts used in notification emails ----------------------------
    studio_name: str = "House of Movements"
    studio_whatsapp: str = "919742508862"

    # --- media ---------------------------------------------------------------
    media_root: str = "var/media"
    media_base_url: str = "/media"

    # --- observability -------------------------------------------------------
    sentry_dsn: str = ""
    sentry_traces_sample_rate: float = 0.0

    @field_validator("web_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip().rstrip("/") for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def docs_enabled(self) -> bool:
        return not self.is_production


@lru_cache
def get_settings() -> Settings:
    return Settings()
