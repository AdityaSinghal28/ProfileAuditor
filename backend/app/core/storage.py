"""
Core storage module for ProfileAuditor backend.
Provides centralized in-memory storage for resumes, verifications, and scores,
decoupling API routes from internal state management.
"""

from typing import Dict, Any, Optional


class InMemoryStore:
    """Centralized thread-safe-ready storage store for session & audit lifecycle."""
    
    def __init__(self):
        self.resumes: Dict[str, Dict[str, Any]] = {}
        self.verifications: Dict[str, Dict[str, Any]] = {}
        self.scores: Dict[str, Any] = {}

    # Resume methods
    def get_resume(self, resume_id: str) -> Optional[Dict[str, Any]]:
        return self.resumes.get(resume_id)

    def set_resume(self, resume_id: str, data: Dict[str, Any]) -> None:
        self.resumes[resume_id] = data

    def delete_resume(self, resume_id: str) -> Optional[Dict[str, Any]]:
        return self.resumes.pop(resume_id, None)

    # Verification methods
    def get_verification(self, resume_id: str) -> Optional[Dict[str, Any]]:
        return self.verifications.get(resume_id)

    def set_verification(self, resume_id: str, data: Dict[str, Any]) -> None:
        self.verifications[resume_id] = data

    # Score methods
    def get_score(self, resume_id: str) -> Optional[Any]:
        return self.scores.get(resume_id)

    def set_score(self, resume_id: str, data: Any) -> None:
        self.scores[resume_id] = data

    def clear(self) -> None:
        self.resumes.clear()
        self.verifications.clear()
        self.scores.clear()


# Global store instance
store = InMemoryStore()

# Direct dictionary references for backward-compatible dict access
resume_storage: Dict[str, Dict[str, Any]] = store.resumes
verification_storage: Dict[str, Dict[str, Any]] = store.verifications
score_storage: Dict[str, Any] = store.scores

