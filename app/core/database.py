from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# Neon works better with asyncpg for FastAPI
DATABASE_URL = settings.DATABASE_URL
if DATABASE_URL:
    # Cleanup URL for asyncpg
    if "sslmode=" in DATABASE_URL:
        # asyncpg doesn't like sslmode in the connection string
        from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
        u = urlparse(DATABASE_URL)
        qs = parse_qs(u.query)
        qs.pop('sslmode', None)
        qs.pop('channel_binding', None)
        DATABASE_URL = urlunparse(u._replace(query=urlencode(qs, doseq=True)))
    
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# For Neon, we often need to specify SSL
engine = create_async_engine(
    DATABASE_URL, 
    echo=True,
    connect_args={"ssl": True} if "neon.tech" in DATABASE_URL else {}
)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
