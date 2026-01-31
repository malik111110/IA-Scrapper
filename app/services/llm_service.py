from openai import AsyncOpenAI

from app.core.config import settings


class LLMService:
    def __init__(self):
        self.client = None
        if settings.GEMINI_API_KEY:
            self.client = AsyncOpenAI(
                api_key=settings.GEMINI_API_KEY,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
                timeout=30.0,
            )

    async def process_content(self, instruction: str, content: str):
        if not self.client:
            return "Gemini API Key not configured."

        try:
            # Using Google Gemini API (OpenAI Compatible)
            response = await self.client.chat.completions.create(
                model=settings.MODEL_NAME,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that extracts data from web content."},
                    {"role": "user", "content": f"{instruction}\n\nContent:\n{content[:20000]}"},
                ],
            )

            # Debugging: Print response to see what's happening
            print(f"LLM Response: {response}")

            if not response or not response.choices:
                return "Error: Empty response from LLM provider."

            return response.choices[0].message.content
        except Exception as e:
            import traceback

            traceback.print_exc()
            return f"Error processing with Gemini: {str(e)}"


llm_service = LLMService()
