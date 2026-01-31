import uvicorn
from fastapi import FastAPI

from fastapi.staticfiles import StaticFiles
from app.api.api import api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(api_router, prefix="/api/v1")

# Serve static files for the dashboard
app.mount("/static", StaticFiles(directory="static"), name="static")


from fastapi.responses import FileResponse

@app.get("/", include_in_schema=False)
async def root():
    return FileResponse("static/index.html")


@app.get("/health")
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
