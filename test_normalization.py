from app.services.normalization_service import normalization_service
from app.schemas.opportunity import Opportunity, TechSignal
from datetime import datetime

def test_company_normalization():
    test_cases = [
        ("Google Inc.", "Google"),
        ("Google Cloud Platform", "Google"),
        ("Microsoft Corp.", "Microsoft"),
        ("Apple Ltd.", "Apple"),
        ("OpenAI S.A.S.", "Openai"), # Default title case if not in aliases
        ("Tesla, Inc.", "Tesla"),
        ("Unknown Entity LLC", "Unknown Entity"),
    ]
    
    for input_name, expected in test_cases:
        result = normalization_service.normalize_company_name(input_name)
        print(f"Input: '{input_name}' -> Result: '{result}' | Expected: '{expected}'")
        assert result == expected

def test_tech_stack_normalization():
    tech_stack = ["react.js", "NextJS", "aws", "postgres", "Docker", "python"]
    expected = ["AWS", "Docker", "Next.js", "PostgreSQL", "Python", "React"]
    
    result = normalization_service.normalize_tech_stack(tech_stack)
    print(f"Input: {tech_stack}")
    print(f"Result: {result}")
    assert result == expected

def test_deduplication():
    normalization_service.clear_cache()
    
    # First time
    assert normalization_service.is_duplicate("Google") is False
    # Second time (case insensitive check)
    assert normalization_service.is_duplicate("google") is True
    # Different company
    assert normalization_service.is_duplicate("Amazon") is False
    
    print("Deduplication test passed!")

if __name__ == "__main__":
    print("Testing Company Normalization...")
    test_company_normalization()
    print("\nTesting Tech Stack Normalization...")
    test_tech_stack_normalization()
    print("\nTesting Deduplication...")
    test_deduplication()
    print("\nAll tests passed!")
