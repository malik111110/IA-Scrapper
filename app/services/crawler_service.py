from crawl4ai import AsyncWebCrawler

class CrawlerService:
    async def crawl_url(self, url: str):
        async with AsyncWebCrawler(verbose=True) as crawler:
            result = await crawler.arun(url=url)
            return result
