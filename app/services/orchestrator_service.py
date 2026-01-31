import asyncio
import json
from typing import List
from app.services.crawler_service import CrawlerService
from app.services.llm_service import llm_service
from app.schemas.opportunity import Opportunity, TechSignal
from app.core.prompts import SYSTEM_PROMPT, USER_EXTRACTION_PROMPT, TECH_NORMALIZATION_PROMPT
from app.services.normalization_service import normalization_service
from app.core.database import AsyncSessionLocal
from app.models.opportunity import OpportunityModel, TechSignalModel
from sqlalchemy import select

class OrchestratorService:
    def __init__(self):
        self.crawler_service = CrawlerService()

    async def run_pipeline(self, urls: List[str]) -> List[Opportunity]:
        # Reset normalization cache for a new run
        normalization_service.clear_cache()
        
        # Pre-filter URLs by domain to avoid concurrent tasks for the same company in the same batch
        unique_batch_urls = []
        seen_batch_domains = set()
        for url in urls:
            domain = normalization_service.extract_domain(url)
            if domain:
                if domain not in seen_batch_domains:
                    seen_batch_domains.add(domain)
                    unique_batch_urls.append(url)
                else:
                    print(f"Pre-filtering duplicate domain in batch: {domain}")
            else:
                unique_batch_urls.append(url)

        tasks = [self.process_single_url(url) for url in unique_batch_urls]
        results = await asyncio.gather(*tasks)
        
        # Filter out None results
        processed_results = [r for r in results if r is not None]
        
        # Normalization & Deduplication
        final_opportunities = []
        for opp in processed_results:
            # 1. Normalize name and tech stack (Rule-based)
            normalized_opp = normalization_service.normalize_opportunity(opp)
            
            # 2. Advanced Deduplication (Domain + Fuzzy Name)
            if not normalization_service.is_duplicate(normalized_opp.company_name, normalized_opp.url):
                # 3. Optional: LLM-based Tech Stack Refinement
                # Only if the rule-based normalization left us with generic or too few tags
                if len(normalized_opp.tech_stack) < 3 or any(len(t) < 3 for t in normalized_opp.tech_stack):
                   await self._refine_tech_stack_with_llm(normalized_opp)
                
                final_opportunities.append(normalized_opp)
            else:
                print(f"Skipping duplicate opportunity (Domain/Fuzzy): {normalized_opp.company_name}")
        
        # 4. Save to Database
        if final_opportunities:
            await self._save_to_db(final_opportunities)
            
        return final_opportunities

    async def _save_to_db(self, opportunities: List[Opportunity]):
        """Persists the opportunities and their signals to Neon."""
        async with AsyncSessionLocal() as session:
            # We don't use begin() here if we want to manage it manually or just use session.add
            # But async session context usually handles it well. 
            for opp in opportunities:
                # Check if URL already exists in DB to prevent duplicates safely
                stmt = select(OpportunityModel).where(OpportunityModel.url == opp.url)
                result = await session.execute(stmt)
                if result.scalar_one_or_none():
                    print(f"Opportunity for {opp.url} already in database. Skipping save.")
                    continue

                # Create Database Model
                db_opp = OpportunityModel(
                    company_name=opp.company_name,
                    sector=opp.sector,
                    url=opp.url,
                    score=opp.score,
                    classification=opp.classification,
                    tech_stack=opp.tech_stack,
                    summary=opp.summary
                )
                
                # Add Signals
                for s in opp.signals:
                    db_signal = TechSignalModel(
                        category=s.category,
                        description=s.description,
                        urgency=s.urgency
                    )
                    db_opp.signals.append(db_signal)
                
                session.add(db_opp)
            
            await session.commit()
            print(f"Successfully saved {len(opportunities)} opportunities to Neon.")

    async def _refine_tech_stack_with_llm(self, opportunity: Opportunity):
        """Uses LLM to clean up and canonicalize tech stack if rules weren't enough."""
        raw_tech = ", ".join(opportunity.tech_stack)
        prompt = TECH_NORMALIZATION_PROMPT.format(tech_terms=raw_tech)
        
        llm_response = await llm_service.process_content("You are a tech stack expert.", prompt)
        if llm_response and "Error" not in llm_response:
            # Parse comma separated list
            new_tech = [t.strip() for t in llm_response.split(",") if t.strip()]
            if new_tech:
                # Apply one last rule-based pass to ensure canonical names
                opportunity.tech_stack = normalization_service.normalize_tech_stack(new_tech)

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
