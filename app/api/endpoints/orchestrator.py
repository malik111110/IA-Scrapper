from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.opportunity import Opportunity, OrchestratorConfig
from app.services.orchestrator_service import orchestrator

router = APIRouter()


@router.post("/run", response_model=List[Opportunity])
async def run_orchestrator(config: OrchestratorConfig):
    urls = config.urls or []
    
    # If source_url is provided, discover URLs first
    if config.source_url:
        discovered = await orchestrator.crawler_service.discover_urls(
            config.source_url, config.css_selector or "a"
        )
        # Combine with provided URLs (if any) and deduplicate
        urls = list(set(urls + discovered))

    if not urls:
        raise HTTPException(status_code=400, detail="No URLs provided and no URLs discovered")

    try:
        opportunities = await orchestrator.run_pipeline(urls)
        return opportunities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
