from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.company import CompanyProfile as CompanyProfileModel
from app.schemas.company import (
    CompanyProfile, 
    CompanyProfileCreate, 
    CompanyProfileUpdate,
    OnboardingMessage,
    OnboardingResponse
)
from app.services.company_service import company_service

router = APIRouter()

@router.get("/", response_model=List[CompanyProfile])
async def get_company_profiles(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
) -> Any:
    """
    Retrieve company profiles.
    """
    result = await db.execute(select(CompanyProfileModel).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=CompanyProfile)
async def create_company_profile(
    *,
    db: AsyncSession = Depends(get_db),
    company_in: CompanyProfileCreate,
) -> Any:
    """
    Create a new company profile.
    """
    db_obj = CompanyProfileModel(**company_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.put("/{profile_id}", response_model=CompanyProfile)
async def update_company_profile(
    *,
    db: AsyncSession = Depends(get_db),
    profile_id: int,
    company_in: CompanyProfileUpdate,
) -> Any:
    """
    Update a company profile.
    """
    result = await db.execute(select(CompanyProfileModel).filter(CompanyProfileModel.id == profile_id))
    db_obj = result.scalar_one_or_none()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    update_data = company_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/{profile_id}", response_model=CompanyProfile)
async def get_company_profile(
    *,
    db: AsyncSession = Depends(get_db),
    profile_id: int,
) -> Any:
    """
    Get a specific company profile.
    """
    result = await db.execute(select(CompanyProfileModel).filter(CompanyProfileModel.id == profile_id))
    db_obj = result.scalar_one_or_none()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_obj

@router.delete("/{profile_id}", response_model=CompanyProfile)
async def delete_company_profile(
    *,
    db: AsyncSession = Depends(get_db),
    profile_id: int,
) -> Any:
    """
    Delete a company profile.
    """
    result = await db.execute(select(CompanyProfileModel).filter(CompanyProfileModel.id == profile_id))
    db_obj = result.scalar_one_or_none()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    await db.delete(db_obj)
    await db.commit()
    return db_obj

@router.post("/onboard", response_model=OnboardingResponse)
async def onboard_company(
    *,
    db: AsyncSession = Depends(get_db),
    onboard_in: OnboardingMessage,
) -> Any:
    """
    Handles conversational onboarding.
    """
    agent_msg, extracted = await company_service.onboard_chat(
        db, onboard_in.message, onboard_in.history
    )
    
    if extracted:
        profile = await company_service.get_default_profile(db)
        if not profile:
            if extracted.get("name"):
                profile = CompanyProfileModel(**extracted)
                db.add(profile)
                await db.commit()
                await db.refresh(profile)
        else:
            for field, value in extracted.items():
                if value is not None:
                    setattr(profile, field, value)
            db.add(profile)
            await db.commit()
            await db.refresh(profile)

    return {
        "agent_response": agent_msg,
        "extracted_profile": extracted,
        "status": "ongoing"
    }
