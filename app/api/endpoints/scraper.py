from fastapi import APIRouter, HTTPException
from app.schemas.scrape import ScrapeRequest, ScrapeResponse
from app.services.crawler_service import CrawlerService
# from app.services.llm_service import llm_service

router = APIRouter()
crawler_service = CrawlerService()

@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_data(request: ScrapeRequest):
    try:
        result = await crawler_service.crawl_url(request.url)
        
        if not result.success:
             raise HTTPException(status_code=400, detail=f"Failed to crawl {request.url}")
        
        # extracted_data = None
        # if request.instruction:
        #     extracted_data = await llm_service.process_content(request.instruction, result.markdown)

        return ScrapeResponse(
            url=request.url,
            content_length=len(result.markdown),
            markdown_preview=result.markdown[:500],
            # extracted_data=extracted_data
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
