from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class TechSignalModel(Base):
    __tablename__ = "tech_signals"
    
    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"))
    category = Column(String)
    description = Column(String)
    urgency = Column(Integer)

class OpportunityModel(Base):
    __tablename__ = "opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)
    sector = Column(String, nullable=True)
    url = Column(String, unique=True, index=True)
    score = Column(Float, default=0.0)
    classification = Column(String)
    tech_stack = Column(JSON)  # Store list of strings
    summary = Column(String)
    detected_at = Column(DateTime, default=datetime.utcnow)
    
    signals = relationship("TechSignalModel", backref="opportunity", cascade="all, delete-orphan")
