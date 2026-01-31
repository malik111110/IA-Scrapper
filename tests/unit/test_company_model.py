import pytest
from app.models.company import CompanyProfile

def test_company_profile_to_llm_context():
    profile = CompanyProfile(
        name="Test Corp",
        description="A test company",
        services=["Service A", "Service B"],
        equipment=["Machine X"],
        experience_years=5,
        specialties=["Spec 1"],
        mission="Our mission",
        target_audience="Everyone"
    )
    
    context = profile.to_llm_context()
    
    assert "Company Name: Test Corp" in context
    assert "Services: Service A, Service B" in context
    assert "Equipment: Machine X" in context
    assert "Experience: 5 years" in context
    assert "Specialties: Spec 1" in context
    assert "Mission: Our mission" in context
    assert "Target Audience: Everyone" in context

def test_company_profile_to_llm_context_empty():
    profile = CompanyProfile(
        name="Empty Corp",
        description="No info",
        services=[],
        equipment=[],
        experience_years=0,
        specialties=[],
        mission="",
        target_audience=""
    )
    
    context = profile.to_llm_context()
    
    assert "No specific services listed" in context
    assert "No specific equipment listed" in context
    assert "No specific specialties listed" in context
