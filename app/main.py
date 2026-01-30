from fastapi import FastAPI
from app.core.config import settings
from app.api.api import api_router
import uvicorn

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
