from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Web Scraper"
    GEMINI_API_KEY: str | None = None
    MODEL_NAME: str = "gemini-flash-latest"
    DATABASE_URL: str | None = None

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
