from openai import AsyncOpenAI
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY:
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def process_content(self, instruction: str, content: str):
        if not self.client:
            return "OpenAI API Key not configured."
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that extracts data from web content."},
                    {"role": "user", "content": f"{instruction}\n\nContent:\n{content[:20000]}"} 
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error processing with OpenAI: {str(e)}"

llm_service = LLMService()
