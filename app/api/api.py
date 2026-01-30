from fastapi import APIRouter
from app.api.endpoints import scraper

api_router = APIRouter()
api_router.include_router(scraper.router, tags=["scraper"])
