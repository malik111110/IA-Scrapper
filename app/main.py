import uvicorn
from fastapi import FastAPI

from fastapi.staticfiles import StaticFiles
from app.api.api import api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(api_router, prefix="/api/v1")

# Serving the frontend will be handled by the build process or dev server
# For production, you would mount the 'frontend/dist' folder here.
# app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="frontend")

@app.get("/health")
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
