from app.services.normalization_service import normalization_service


def test_company_normalization():
    test_cases = [
        ("Google Inc.", "Google"),
        ("Google Cloud Platform", "Google"),
        ("Microsoft Corp.", "Microsoft"),
        ("Apple Ltd.", "Apple"),
        ("OpenAI S.A.S.", "Openai"),
        ("Tesla, Inc.", "Tesla"),
        ("Unknown Entity LLC", "Unknown Entity"),
    ]

    for input_name, expected in test_cases:
        result = normalization_service.normalize_company_name(input_name)
        print(f"Input: '{input_name}' -> Result: '{result}' | Expected: '{expected}'")
        assert result == expected


def test_tech_stack_normalization():
    tech_stack = ["react.js", "NextJS", "aws", "postgres", "Docker", "python", "software development", "FastAPI", "Rest API"]
    expected = ["AWS", "Docker", "FastAPI", "Next.js", "PostgreSQL", "Python", "React"]

    result = normalization_service.normalize_tech_stack(tech_stack)
    print(f"Input: {tech_stack}")
    print(f"Result: {result}")
    for item in expected:
        assert item in result
    assert "Software development" not in result
    assert "Rest API" not in result


def test_domain_extraction():
    test_cases = [
        ("https://jobs.lever.co/google/123", "lever.co"),
        ("https://www.google.com/careers", "google.com"),
        ("http://sub.domain.company.co.uk/path", "company.co.uk"),
    ]
    for url, expected in test_cases:
        result = normalization_service.extract_domain(url)
        print(f"URL: {url} -> Domain: {result}")
        assert result == expected


def test_advanced_deduplication():
    normalization_service.clear_cache()

    # 1. Domain-based deduplication
    url1 = "https://google.com/jobs/1"
    url2 = "https://google.com/jobs/2"
    assert normalization_service.is_duplicate("Google", url1) is False
    assert normalization_service.is_duplicate("Google Inc", url2) is True
    print("Domain deduplication passed!")

    # 2. Fuzzy name deduplication (even with different domains)
    normalization_service.clear_cache()
    n1 = normalization_service.normalize_company_name("Microsoft Corp")
    n2 = normalization_service.normalize_company_name("Micro-soft")

    assert normalization_service.is_duplicate(n1, "https://ms1.com") is False
    assert normalization_service.is_duplicate(n2, "https://ms2.com") is True
    print("Fuzzy name deduplication passed!")


if __name__ == "__main__":
    print("Testing Company Normalization...")
    test_company_normalization()
    print("\nTesting Tech Stack Normalization...")
    test_tech_stack_normalization()
    print("\nTesting Domain Extraction...")
    test_domain_extraction()
    print("\nTesting Advanced Deduplication...")
    test_advanced_deduplication()
    print("\nAll tests passed!")
