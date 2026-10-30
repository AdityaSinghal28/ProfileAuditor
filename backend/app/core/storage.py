"""
Core storage module for ProfileAuditor backend.
Provides centralized in-memory storage for resumes, verifications, and scores,
with automatic TTL eviction to prevent memory leaks over time.
"""

import time
from typing import Dict, Any, Optional

DEFAULT_TTL_SECONDS = 7200  # 2 hours


class InMemoryStore:
    """Centralized storage store for session & audit lifecycle with TTL pruning."""

    def __init__(self, ttl_seconds: int = DEFAULT_TTL_SECONDS):
        self.ttl_seconds = ttl_seconds
        self.resumes: Dict[str, Dict[str, Any]] = {}
        self.verifications: Dict[str, Dict[str, Any]] = {}
        self.scores: Dict[str, Any] = {}
        self.timestamps: Dict[str, float] = {}

    def _touch(self, resume_id: str) -> None:
        self.timestamps[resume_id] = time.time()
        # Periodic auto-pruning if storage has grown
        if len(self.timestamps) > 50:
            self.prune_expired()

    def prune_expired(self, max_age: Optional[int] = None) -> int:
        """Evict records older than TTL to prevent memory leaks."""
        cutoff = time.time() - (max_age or self.ttl_seconds)
        expired_ids = [rid for rid, ts in self.timestamps.items() if ts < cutoff]
        for rid in expired_ids:
            self.resumes.pop(rid, None)
            self.verifications.pop(rid, None)
            self.scores.pop(rid, None)
            self.timestamps.pop(rid, None)
        return len(expired_ids)

    # Resume methods
    def get_resume(self, resume_id: str) -> Optional[Dict[str, Any]]:
        return self.resumes.get(resume_id)

    def set_resume(self, resume_id: str, data: Dict[str, Any]) -> None:
        self.resumes[resume_id] = data
        self._touch(resume_id)

    def delete_resume(self, resume_id: str) -> Optional[Dict[str, Any]]:
        self.timestamps.pop(resume_id, None)
        return self.resumes.pop(resume_id, None)

    # Verification methods
    def get_verification(self, resume_id: str) -> Optional[Dict[str, Any]]:
        return self.verifications.get(resume_id)

    def set_verification(self, resume_id: str, data: Dict[str, Any]) -> None:
        self.verifications[resume_id] = data
        self._touch(resume_id)

    # Score methods
    def get_score(self, resume_id: str) -> Optional[Any]:
        return self.scores.get(resume_id)

    def set_score(self, resume_id: str, data: Any) -> None:
        self.scores[resume_id] = data
        self._touch(resume_id)

    def clear(self) -> None:
        self.resumes.clear()
        self.verifications.clear()
        self.scores.clear()
        self.timestamps.clear()


# Global store instance
store = InMemoryStore()

# Direct dictionary references for backward-compatible dict access
resume_storage: Dict[str, Dict[str, Any]] = store.resumes
verification_storage: Dict[str, Dict[str, Any]] = store.verifications
score_storage: Dict[str, Any] = store.scores
