from crawl4ai import AsyncWebCrawler


class CrawlerService:
    async def crawl_url(self, url: str):
        async with AsyncWebCrawler(verbose=True) as crawler:
            result = await crawler.arun(url=url)
            return result

    async def discover_urls(self, source_url: str, css_selector: str) -> list[str]:
        """Discovers URLs from a index/list page using a CSS selector."""
        async with AsyncWebCrawler(verbose=True) as crawler:
            result = await crawler.arun(url=source_url)
            if result.success and result.links:
                # Filter links by specified CSS selector area or just return internal/external relevant ones
                # For MVP, we'll return all unique links that look like company pages or job posts
                links = [link['href'] for link in result.links.get("internal", []) + result.links.get("external", [])]
                return list(set(links))
            return []
