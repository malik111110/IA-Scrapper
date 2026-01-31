from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.opportunity import Opportunity, OrchestratorConfig
from app.services.orchestrator_service import orchestrator

router = APIRouter()

@router.post("/run", response_model=List[Opportunity])
async def run_orchestrator(config: OrchestratorConfig):
    if not config.urls:
        raise HTTPException(status_code=400, detail="No URLs provided")
    
    try:
        opportunities = await orchestrator.run_pipeline(config.urls)
        return opportunities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
