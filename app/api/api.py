from fastapi import APIRouter

from app.api.endpoints import opportunities, orchestrator, scraper, matchmaker

api_router = APIRouter()
api_router.include_router(scraper.router, tags=["scraper"])
api_router.include_router(orchestrator.router, prefix="/orchestrator", tags=["orchestrator"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["opportunities"])
api_router.include_router(matchmaker.router, prefix="/matchmaker", tags=["matchmaker"])
