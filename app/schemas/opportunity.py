from typing import List, Optional
from pydantic import BaseModel

class MatchRequest(BaseModel):
    user_company_info: str
    search_query: str
    platforms: List[str] = ["indeed", "openclassrooms"]

class MatchResponse(BaseModel):
    company_name: str
    matching_score: float
    fit_analysis: str
    reasoning_signals: List[str]
    url: str
    tech_stack: List[str]
    summary: str
