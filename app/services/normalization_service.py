import re
from typing import List, Set
from app.schemas.opportunity import Opportunity

class NormalizationService:
    # Compile regex patterns for common legal suffixes
    LEGAL_SUFFIXES = [
        re.compile(r"\binc\b\.?", re.IGNORECASE),
        re.compile(r"\bltd\b\.?", re.IGNORECASE),
        re.compile(r"\bs\.a\.s\b\.?", re.IGNORECASE),
        re.compile(r"\bgmbh\b\.?", re.IGNORECASE),
        re.compile(r"\bllc\b\.?", re.IGNORECASE),
        re.compile(r"\bcorp\b\.?", re.IGNORECASE),
        re.compile(r"\bcorporation\b\.?", re.IGNORECASE),
        re.compile(r"\bs\.a\b\.?", re.IGNORECASE),
        re.compile(r"\bplc\b\.?", re.IGNORECASE),
        re.compile(r"\bs\.l\b\.?", re.IGNORECASE),
    ]
    
    # Canonical mapping for tech stack
    TECH_MAPPING = {
        "react.js": "React",
        "reactjs": "React",
        "react": "React",
        "next.js": "Next.js",
        "nextjs": "Next.js",
        "vue.js": "Vue.js",
        "vuejs": "Vue.js",
        "vue": "Vue.js",
        "postgresql": "PostgreSQL",
        "postgres": "PostgreSQL",
        "aws": "AWS",
        "amazon web services": "AWS",
        "google cloud": "GCP",
        "google cloud platform": "GCP",
        "gcp": "GCP",
        "microsoft azure": "Azure",
        "azure": "Azure",
        "node": "Node.js",
        "nodejs": "Node.js",
        "node.js": "Node.js",
        "typescript": "TypeScript",
        "ts": "TypeScript",
        "javascript": "JavaScript",
        "js": "JavaScript",
        "python": "Python",
        "py": "Python",
        "kubernetes": "Kubernetes",
        "k8s": "Kubernetes",
        "docker": "Docker",
        "mongodb": "MongoDB",
        "redis": "Redis",
        "graphql": "GraphQL",
        "fastapi": "FastAPI",
        "django": "Django",
        "flask": "Flask"
    }

    # Groups of names that should map to a single entity
    # (e.g., "Google Cloud" and "Google Ireland" -> "Google")
    COMPANY_ALIASES = {
        "google": ["google cloud", "google cloud platform", "google inc", "google llc", "google ireland"],
        "amazon": ["amazon web services", "aws", "amazon com"],
        "microsoft": ["microsoft azure", "microsoft corp"],
        "meta": ["facebook", "meta platforms"],
    }

    # Tech terms that are too generic and should be ignored
    GENERIC_TECH_TERMS = {
        "software", "development", "engineering", "cloud", "devops", 
        "backend", "frontend", "fullstack", "agile", "scrum", "sdlc"
    }

    def __init__(self):
        # This cache is per-instance. For a single pipeline run, it works.
        # For long-term deduplication, we would check a database.
        self._processed_companies: Set[str] = set()

    def clear_cache(self):
        """Clears the deduplication cache for a new batch run."""
        self._processed_companies.clear()

    def normalize_company_name(self, name: str) -> str:
        if not name:
            return "Unknown"
        
        # 1. Basic cleanup
        clean_name = name.strip()
        
        # 2. Remove legal suffixes
        for pattern in self.LEGAL_SUFFIXES:
            clean_name = pattern.sub("", clean_name).strip()
        
        # 3. Handle specific aliases (check if clean_name contains any of the aliases)
        lower_name = clean_name.lower()
        for canonical, aliases in self.COMPANY_ALIASES.items():
            if lower_name == canonical or any(alias in lower_name for alias in aliases):
                return canonical.title()

        # 4. Remove extra punctuation at the end (e.g. commas after company name before suffix)
        clean_name = re.sub(r'[,.\s]+$', '', clean_name)
        
        # 5. Return Title Case
        return clean_name.title() if clean_name else "Unknown"

    def normalize_tech_stack(self, tech_stack: List[str]) -> List[str]:
        if not tech_stack:
            return []
            
        normalized = set()
        for tech in tech_stack:
            clean_tech = tech.lower().strip()
            
            # Skip generic noise
            if clean_tech in self.GENERIC_TECH_TERMS:
                continue
                
            # Map based on dictionary
            canonical = self.TECH_MAPPING.get(clean_tech, tech)
            normalized.add(canonical)
            
        return sorted(list(normalized))

    def is_duplicate(self, company_name: str) -> bool:
        """
        Checks if the company has already been processed in the current run.
        Uses the normalized name for comparison.
        """
        norm_name = company_name.lower()
        if norm_name in self._processed_companies:
            return True
        self._processed_companies.add(norm_name)
        return False

    def normalize_opportunity(self, opportunity: Opportunity) -> Opportunity:
        """Applies all normalization rules to an Opportunity object."""
        # Normalize Company
        opportunity.company_name = self.normalize_company_name(opportunity.company_name)
        
        # Normalize Tech Stack
        opportunity.tech_stack = self.normalize_tech_stack(opportunity.tech_stack)
        
        return opportunity

normalization_service = NormalizationService()
