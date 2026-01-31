from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class TechSignal(BaseModel):
    id: Optional[int] = None
    category: str
    description: str
    urgency: int = Field(ge=1, le=5)

    model_config = {"from_attributes": True}


class Opportunity(BaseModel):
    id: Optional[int] = None
    company_name: str
    sector: Optional[str] = None
    url: str
    score: float = 0.0
    classification: str
    signals: List[TechSignal]
    tech_stack: List[str]
    summary: str
    detected_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class OrchestratorConfig(BaseModel):
    urls: Optional[List[str]] = None
    source_url: Optional[str] = None
    css_selector: Optional[str] = None
    instruction: Optional[str] = None


class OpportunityListResponse(BaseModel):
    total: int
    opportunities: List[Opportunity]
