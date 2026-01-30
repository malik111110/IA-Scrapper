from pydantic import BaseModel

class ScrapeRequest(BaseModel):
    url: str
    instruction: str = "Extract the main content of the page."

class ScrapeResponse(BaseModel):
    url: str
    content_length: int
    markdown_preview: str
    # extracted_data: str | None = None
