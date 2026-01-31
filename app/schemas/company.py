from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class CompanyProfileBase(BaseModel):
    name: str
    description: Optional[str] = None
    services: List[str] = []
    equipment: List[str] = []
    experience_years: Optional[int] = None
    specialties: List[str] = []
    mission: Optional[str] = None
    target_audience: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[EmailStr] = None

class CompanyProfileCreate(CompanyProfileBase):
    pass

class CompanyProfileUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    services: Optional[List[str]] = None
    equipment: Optional[List[str]] = None
    experience_years: Optional[int] = None
    specialties: Optional[List[str]] = None
    mission: Optional[str] = None
    target_audience: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[EmailStr] = None

class CompanyProfile(CompanyProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class OnboardingMessage(BaseModel):
    message: str
    history: List[dict] = []

class OnboardingResponse(BaseModel):
    agent_response: str
    extracted_profile: Optional[CompanyProfileUpdate] = None
    status: str = "ongoing" # or "complete"
