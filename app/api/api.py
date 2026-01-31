from fastapi import APIRouter
from app.api.endpoints import scraper, orchestrator

api_router = APIRouter()
api_router.include_router(scraper.router, tags=["scraper"])
api_router.include_router(orchestrator.router, prefix="/orchestrator", tags=["orchestrator"])
