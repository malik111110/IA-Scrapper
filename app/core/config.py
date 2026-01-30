from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Web Scraper"
    OPENAI_API_KEY: str | None = None
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
