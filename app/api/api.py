from fastapi import APIRouter

from app.api.endpoints import matchmaker

api_router = APIRouter()
api_router.include_router(matchmaker.router, prefix="/matchmaker", tags=["matchmaker"])
