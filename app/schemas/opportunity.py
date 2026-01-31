from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class TechSignal(BaseModel):
    category: str  # e.g., "Maturity", "Hiring", "Tech Stack"
    description: str
    urgency: int = Field(ge=1, le=5)

class Opportunity(BaseModel):
    company_name: str
    sector: Optional[str] = None
    url: str
    score: float = 0.0
    classification: str  # "High probability", "Mid-term", "Low fit"
    signals: List[TechSignal]
    tech_stack: List[str]
    summary: str
    detected_at: datetime = Field(default_factory=datetime.now)

class OrchestratorConfig(BaseModel):
    urls: List[str]
    instruction: Optional[str] = None
