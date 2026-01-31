import re
from typing import List, Optional, Set

import tldextract
from rapidfuzz import fuzz, process

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
        "react.js": "React", "reactjs": "React", "react": "React",
        "next.js": "Next.js", "nextjs": "Next.js",
        "vue.js": "Vue.js", "vuejs": "Vue.js", "vue": "Vue.js",
        "postgresql": "PostgreSQL", "postgres": "PostgreSQL",
        "aws": "AWS", "amazon web services": "AWS",
        "google cloud": "GCP", "google cloud platform": "GCP", "gcp": "GCP",
        "microsoft azure": "Azure", "azure": "Azure",
        "node": "Node.js", "nodejs": "Node.js", "node.js": "Node.js",
        "typescript": "TypeScript", "ts": "TypeScript",
        "javascript": "JavaScript", "js": "JavaScript",
        "python": "Python", "py": "Python",
        "kubernetes": "Kubernetes", "k8s": "Kubernetes",
        "docker": "Docker", "mongodb": "MongoDB", "redis": "Redis",
        "graphql": "GraphQL", "fastapi": "FastAPI", "django": "Django", "flask": "Flask"
    }

    # Company alias mapping
    COMPANY_ALIASES = {
        "google": ["google cloud", "google cloud platform", "google inc", "google llc", "google ireland"],
        "amazon": ["amazon web services", "aws", "amazon com"],
        "microsoft": ["microsoft azure", "microsoft corp"],
        "meta": ["facebook", "meta platforms"],
    }

    # Tech terms that are too generic and should be ignored
    GENERIC_TECH_TERMS = {
        "software", "development", "engineering", "cloud", "devops", 
        "backend", "frontend", "fullstack", "agile", "scrum", "sdlc",
        "api", "web", "mobile", "app", "application"
    }

    def __init__(self):
        self._processed_companies: Set[str] = set()
        self._processed_domains: Set[str] = set()
        self.fuzzy_threshold = 80  # Lowered for better recall

    def clear_cache(self):
        """Clears the deduplication cache."""
        self._processed_companies.clear()
        self._processed_domains.clear()

    def extract_domain(self, url: str) -> Optional[str]:
        """Extracts the registered domain (e.g., google.com) from a URL."""
        if not url:
            return None
        try:
            ext = tldextract.extract(url)
            if ext.domain and ext.suffix:
                return f"{ext.domain}.{ext.suffix}".lower()
        except Exception:
            pass
        return None

    def normalize_company_name(self, name: str) -> str:
        if not name:
            return "Unknown"
        
        # 1. Basic cleanup
        clean_name = name.strip()
        
        # 2. Remove legal suffixes
        for pattern in self.LEGAL_SUFFIXES:
            clean_name = pattern.sub("", clean_name).strip()
        
        # 3. Handle specific aliases
        lower_name = clean_name.lower()
        for canonical, aliases in self.COMPANY_ALIASES.items():
            if lower_name == canonical or any(alias in lower_name for alias in aliases):
                return canonical.title()

        # 4. Remove punctuation and extra noise
        clean_name = re.sub(r'[,.\s-]+$', '', clean_name) # End of string
        # For internal matching, we'll keep it readable in the object but clean it more for the SET
        
        # 5. Return Title Case
        return clean_name.title() if clean_name else "Unknown"

    def _prepare_for_matching(self, name: str) -> str:
        """Internal helper to clean names strictly for comparison (no spaces, no punctuation)."""
        return re.sub(r'[^a-z0-9]', '', name.lower())

    def normalize_tech_stack(self, tech_stack: List[str]) -> List[str]:
        if not tech_stack:
            return []
            
        normalized = set()
        for tech in tech_stack:
            clean_tech = tech.lower().strip()
            
            # Skip generic noise and very short strings
            if any(term in clean_tech for term in self.GENERIC_TECH_TERMS) or len(clean_tech) < 2:
                continue
                
            # Map based on dictionary
            canonical = self.TECH_MAPPING.get(clean_tech, tech)
            normalized.add(canonical)
            
        return sorted(list(normalized))

    def is_duplicate(self, company_name: str, url: str = None) -> bool:
        """
        Hyper-aggressive deduplication check.
        Checks by Domain (Strongest) and then by Fuzzy Name Matching.
        """
        # 1. Domain Check
        domain = self.extract_domain(url)
        if domain:
            if domain in self._processed_domains:
                print(f"Duplicate found by domain: {domain}")
                return True
            self._processed_domains.add(domain)

        # 2. Match-ready Name Check
        match_name = self._prepare_for_matching(company_name)
        
        # 3. Fuzzy Matching
        if self._processed_companies:
            best_match = process.extractOne(match_name, self._processed_companies, scorer=fuzz.ratio)
            if best_match and best_match[1] >= self.fuzzy_threshold:
                print(f"Duplicate found by fuzzy name match: {match_name} ~ {best_match[0]} ({best_match[1]}%)")
                return True

        self._processed_companies.add(match_name)
        return False

    def normalize_opportunity(self, opportunity: Opportunity) -> Opportunity:
        # Normalize Company
        opportunity.company_name = self.normalize_company_name(opportunity.company_name)
        
        # Normalize Tech Stack
        opportunity.tech_stack = self.normalize_tech_stack(opportunity.tech_stack)
        
        return opportunity

normalization_service = NormalizationService()
