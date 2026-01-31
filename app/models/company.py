from sqlalchemy import Column, Integer, String, Text, JSON, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    services = Column(JSON, default=[])
    equipment = Column(JSON, default=[])
    experience_years = Column(Integer)
    specialties = Column(JSON, default=[])
    mission = Column(Text)
    target_audience = Column(Text)
    website = Column(String(255))
    contact_email = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    def to_llm_context(self) -> str:
        """Consolidates company info into a string for LLM search/matching."""
        services_str = ", ".join(self.services) if self.services else "No specific services listed"
        eq_str = ", ".join(self.equipment) if self.equipment else "No specific equipment listed"
        spec_str = ", ".join(self.specialties) if self.specialties else "No specific specialties listed"
        
        return (
            f"Company Name: {self.name}\n"
            f"Description: {self.description}\n"
            f"Services: {services_str}\n"
            f"Equipment: {eq_str}\n"
            f"Experience: {self.experience_years} years\n"
            f"Specialties: {spec_str}\n"
            f"Mission: {self.mission}\n"
            f"Target Audience: {self.target_audience}"
        )
