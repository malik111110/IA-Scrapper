import asyncio

from app.core.database import Base, engine
from app.models.company import CompanyProfile # Import models to register them with Base


async def init_db():
    async with engine.begin() as conn:
        # Import all models here or ensure they are registered with Base
        print("Creating tables in Neon...")
        await conn.run_sync(Base.metadata.create_all)
        print("Done!")


if __name__ == "__main__":
    asyncio.run(init_db())
