from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.company import CompanyProfile
from typing import Optional

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

company_service = CompanyService()
