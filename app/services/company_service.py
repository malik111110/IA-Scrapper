from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.company import CompanyProfile
from typing import Optional
from app.services.llm_service import llm_service
from app.core.prompts import ONBOARDING_SYSTEM_PROMPT, ONBOARDING_EXTRACTION_PROMPT
import json

class CompanyService:
    async def get_default_profile(self, db: AsyncSession) -> Optional[CompanyProfile]:
        """
        Retrieves the first company profile found in the database.
        In a multi-user system, this would be filtered by user_id.
        """
        result = await db.execute(select(CompanyProfile).limit(1))
        return result.scalar_one_or_none()

    async def get_company_context(self, db: AsyncSession) -> str:
        """
        Returns a string representation of the company profile for LLM context.
        """
        profile = await self.get_default_profile(db)
        if profile:
            return profile.to_llm_context()
        return "No company profile configured. Please set up your company profile first."

    async def onboard_chat(self, db: AsyncSession, message: str, history: list):
        """
        Handles sequential onboarding via chat.
        """
        profile = await self.get_default_profile(db)
        profile_str = profile.to_llm_context() if profile else "No profile yet."
        
        # 1. Get Agent Response
        system_p = ONBOARDING_SYSTEM_PROMPT.format(current_profile=profile_str)
        # Construct messages for OpenAI format if possible, or just string it
        full_history = "\n".join([f"{h['role']}: {h['content']}" for h in history])
        user_p = f"Conversation History:\n{full_history}\n\nUser Message: {message}"
        
        agent_response = await llm_service.process_content(system_p, user_p)
        
        # 2. Extract Data
        current_json = json.dumps(profile.__dict__ if profile else {}, default=str)
        extract_p = ONBOARDING_EXTRACTION_PROMPT.format(history=user_p, current_json=current_json)
        
        extracted_data_raw = await llm_service.process_content("You are a data extractor. Return JSON only.", extract_p)
        
        extracted_data = {}
        try:
            cleaned_json = extracted_data_raw.strip()
            if cleaned_json.startswith("```json"):
                cleaned_json = cleaned_json[7:-3].strip()
            extracted_data = json.loads(cleaned_json)
        except:
            pass
            
        return agent_response, extracted_data

company_service = CompanyService()
