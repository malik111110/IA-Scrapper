from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas.opportunity import MatchRequest, MatchResponse
from app.services.search_service import search_service
from app.services.crawler_service import CrawlerService
from app.services.llm_service import llm_service
from app.core.prompts import MATCHMAKER_SYSTEM_PROMPT, MATCHMAKER_EXTRACTION_PROMPT
import json
import asyncio

router = APIRouter()
crawler_service = CrawlerService()

@router.post("/chat", response_model=List[MatchResponse])
async def match_company(request: MatchRequest):
    # 1. Search for URLs across platforms
    search_tasks = [search_service.search_opportunities(p, request.search_query) for p in request.platforms]
    url_results = await asyncio.gather(*search_tasks)
    
    all_urls = []
    for urls in url_results:
        all_urls.extend(urls)
    
    all_urls = list(set(all_urls))[:10] # Limit to 10 for performance in demo
    
    if not all_urls:
         # Fallback or informative error
         return []

    # 2. Process each URL with the matchmaker prompts
    match_tasks = [process_match(url, request.user_company_info) for url in all_urls]
    results = await asyncio.gather(*match_tasks)
    
    # Filter out None results and sort by score
    valid_results = [r for r in results if r]
    valid_results.sort(key=lambda x: x.matching_score, reverse=True)
    
    return valid_results

async def process_match(url: str, user_info: str) -> MatchResponse:
    try:
        # Scrape
        crawl_result = await crawler_service.crawl_url(url)
        if not crawl_result.success:
            return None
        
        # Match with LLM
        system_p = MATCHMAKER_SYSTEM_PROMPT.format(user_company_info=user_info)
        user_p = MATCHMAKER_EXTRACTION_PROMPT.format(content=crawl_result.markdown[:15000])
        
        response = await llm_service.process_content(system_p, user_p)
        
        # Parse
        cleaned_json = response.strip()
        if cleaned_json.startswith("```json"):
            cleaned_json = cleaned_json[7:-3].strip()
        
        data = json.loads(cleaned_json)
        
        return MatchResponse(
            company_name=data.get("company_name", "Unknown"),
            matching_score=float(data.get("matching_score", 0)),
            fit_analysis=data.get("fit_analysis", ""),
            reasoning_signals=data.get("reasoning_signals", []),
            url=url,
            tech_stack=data.get("tech_stack", []),
            summary=data.get("summary", "")
        )
    except Exception as e:
        print(f"Error matching {url}: {e}")
        return None
