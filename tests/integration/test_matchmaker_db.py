import pytest
from httpx import AsyncClient
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_matchmaker_uses_db_profile(client: AsyncClient):
    # 1. Create a company profile in the test DB
    await client.post(
        "/api/v1/company/",
        json={
            "name": "Scrapyard Inc",
            "description": "We specialize in scraping the hardest webs.",
            "services": ["Professional Scraping", "Data Analysis"]
        }
    )
    
    # 2. Mock search_service and crawler_service and llm_service to avoid external calls
    with patch("app.api.endpoints.matchmaker.search_service.search_opportunities") as mock_search, \
         patch("app.api.endpoints.matchmaker.CrawlerService.crawl_url") as mock_crawl, \
         patch("app.api.endpoints.matchmaker.llm_service.process_content") as mock_llm:
        
        mock_search.return_value = ["https://test-opportunity.com"]
        
        mock_crawl_result = MagicMock()
        mock_crawl_result.success = True
        mock_crawl_result.markdown = "Found a great job for scrapers!"
        mock_crawl.return_value = mock_crawl_result
        
        mock_llm.return_value = """
        {
            "company_name": "Target Tech",
            "matching_score": 0.95,
            "fit_analysis": "Perfect match for Scrapyard Inc",
            "reasoning_signals": ["Expertise in scraping"],
            "tech_stack": ["Python", "Selenium"],
            "summary": "Great role"
        }
        """
        
        # 3. Request matching without providing user_company_info
        response = await client.post(
            "/api/v1/matchmaker/chat",
            json={
                "search_query": "web scraping developer",
                "platforms": ["indeed"]
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert data[0]["company_name"] == "Target Tech"
        
        # 4. Verify LLM was called with the database profile (check system prompt)
        # The first argument to process_content is the system prompt
        # It should contain "Scrapyard Inc"
        call_args = mock_llm.call_args[0]
        system_prompt = call_args[0]
        assert "Scrapyard Inc" in system_prompt
        assert "Professional Scraping" in system_prompt
