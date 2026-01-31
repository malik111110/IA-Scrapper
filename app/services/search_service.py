from typing import List
import urllib.parse
from app.services.crawler_service import CrawlerService

class SearchService:
    def __init__(self):
        self.crawler_service = CrawlerService()

    def generate_indeed_url(self, query: str, location: str = "remote") -> str:
        base_url = "https://www.indeed.com/jobs"
        params = {
            "q": query,
            "l": location
        }
        return f"{base_url}?{urllib.parse.urlencode(params)}"

    def generate_openclassrooms_url(self, query: str) -> str:
        # OpenClassrooms job/recruitment pages usually follow a patterns or use external boards like Welcome to the Jungle
        # For now, let's assume a generic search or a specific recruitment landing page
        # Note: OpenClassrooms often has a "recruiter" section or uses job boards.
        base_url = "https://openclassrooms.com/en/search"
        params = {"query": query}
        return f"{base_url}?{urllib.parse.urlencode(params)}"

    async def search_opportunities(self, platform: str, query: str) -> List[str]:
        if platform.lower() == "indeed":
            url = self.generate_indeed_url(query)
            # Indeed may require specific headers or a more complex crawler setup due to anti-bot
            # For the demo, we'll try to discover links from the results page
            return await self.crawler_service.discover_urls(url, "a.jcs-JobTitle")
        elif platform.lower() == "openclassrooms":
            url = self.generate_openclassrooms_url(query)
            return await self.crawler_service.discover_urls(url, "a")
        return []

search_service = SearchService()
