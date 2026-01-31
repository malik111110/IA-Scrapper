import asyncio
import json
from typing import List
from app.services.crawler_service import CrawlerService
from app.services.llm_service import llm_service
from app.schemas.opportunity import Opportunity, TechSignal
from app.core.prompts import SYSTEM_PROMPT, USER_EXTRACTION_PROMPT
from app.services.normalization_service import normalization_service

class OrchestratorService:
    def __init__(self):
        self.crawler_service = CrawlerService()

    async def run_pipeline(self, urls: List[str]) -> List[Opportunity]:
        # Reset normalization cache for a new run
        normalization_service.clear_cache()
        
        tasks = [self.process_single_url(url) for url in urls]
        results = await asyncio.gather(*tasks)
        
        # Filter out None results
        processed_results = [r for r in results if r is not None]
        
        # Normalization & Deduplication
        final_opportunities = []
        for opp in processed_results:
            # First normalize
            normalized_opp = normalization_service.normalize_opportunity(opp)
            
            # Then check for duplicates (based on normalized company name)
            if not normalization_service.is_duplicate(normalized_opp.company_name):
                final_opportunities.append(normalized_opp)
            else:
                print(f"Skipping duplicate opportunity for company: {normalized_opp.company_name}")
        
        return final_opportunities

    async def process_single_url(self, url: str) -> Opportunity:
        # 1. Scrape
        crawl_result = await self.crawler_service.crawl_url(url)
        if not crawl_result.success:
            print(f"Failed to crawl {url}")
            return None

        # 2. Extract with LLM
        prompt = USER_EXTRACTION_PROMPT.format(content=crawl_result.markdown[:15000])
        llm_response = await llm_service.process_content(SYSTEM_PROMPT, prompt)

        # 3. Parse and Score
        try:
            # Basic cleanup of LLM response in case of markdown formatting
            cleaned_json = llm_response.strip()
            if cleaned_json.startswith("```json"):
                cleaned_json = cleaned_json[7:-3].strip()
            
            data = json.loads(cleaned_json)
            
            # Simple Scoring Heuristic
            base_score = 0
            signals_data = data.get("signals", [])
            signals = [TechSignal(**s) for s in signals_data]
            for s in signals:
                base_score += s.urgency * 2
            
            classification = "Low agency fit"
            if base_score > 15:
                classification = "High probability outsourcing candidate"
            elif base_score > 8:
                classification = "Mid-term opportunity"

            return Opportunity(
                company_name=data.get("company_name", "Unknown"),
                sector=data.get("sector"),
                url=url,
                score=float(base_score),
                classification=classification,
                signals=signals,
                tech_stack=data.get("tech_stack", []),
                summary=data.get("summary", "No summary available")
            )
        except Exception as e:
            print(f"Error parsing LLM response for {url}: {e}")
            return None

orchestrator = OrchestratorService()
