from fastapi import APIRouter

from app.api.endpoints import matchmaker, company

api_router = APIRouter()
api_router.include_router(matchmaker.router, prefix="/matchmaker", tags=["matchmaker"])
api_router.include_router(company.router, prefix="/company", tags=["company"])
