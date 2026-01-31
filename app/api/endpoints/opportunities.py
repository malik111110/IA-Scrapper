from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from app.core.database import get_db
from app.models.opportunity import OpportunityModel
from app.schemas.opportunity import Opportunity, OpportunityListResponse
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.get("/", response_model=OpportunityListResponse)
async def get_opportunities(
    skip: int = 0, 
    limit: int = 20, 
    sector: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Fetch all stored opportunities from Neon.
    Supports basic pagination and filtering by sector.
    """
    query = select(OpportunityModel).options(selectinload(OpportunityModel.signals))
    
    if sector:
        query = query.where(OpportunityModel.sector.ilike(f"%{sector}%"))
    
    # Get total count for pagination metadata
    count_query = select(func.count()).select_from(OpportunityModel)
    if sector:
        count_query = count_query.where(OpportunityModel.sector.ilike(f"%{sector}%"))
        
    total_count = await db.scalar(count_query)
    
    # Execute paginated query
    query = query.offset(skip).limit(limit).order_by(OpportunityModel.detected_at.desc())
    result = await db.execute(query)
    opportunities = result.scalars().all()
    
    return {
        "total": total_count,
        "opportunities": opportunities
    }

@router.get("/{opportunity_id}", response_model=Opportunity)
async def get_opportunity(
    opportunity_id: int, 
    db: AsyncSession = Depends(get_db)
):
    """Fetch a single opportunity by ID."""
    query = select(OpportunityModel).options(selectinload(OpportunityModel.signals)).where(OpportunityModel.id == opportunity_id)
    result = await db.execute(query)
    opportunity = result.scalar_one_or_none()
    
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
        
    return opportunity
