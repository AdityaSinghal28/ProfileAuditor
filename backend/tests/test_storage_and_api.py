"""
Test storage decoupling and API endpoint integration without external dependencies.
"""

import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import root, health
from app.api.endpoints.resume import create_test_resume, get_resume
from app.api.endpoints.score import evaluate_live_ats, LiveAtsRequest
from app.core.storage import store, resume_storage, verification_storage, score_storage


def test_storage():
    print("Testing app.core.storage...")
    store.clear()
    
    # Verify empty
    assert len(store.resumes) == 0
    assert len(store.verifications) == 0
    assert len(store.scores) == 0
    
    # Test setting and getting
    store.set_resume("test-1", {"resume_id": "test-1", "name": "Jane Doe"})
    assert store.get_resume("test-1")["name"] == "Jane Doe"
    assert resume_storage["test-1"]["name"] == "Jane Doe"
    
    store.set_verification("test-1", {"status": "completed"})
    assert verification_storage["test-1"]["status"] == "completed"
    
    store.set_score("test-1", {"score": 85.0})
    assert score_storage["test-1"]["score"] == 85.0
    
    store.clear()
    assert len(store.resumes) == 0
    print("✅ app.core.storage tests passed!")


async def async_test_endpoints():
    print("Testing endpoint handlers directly...")
    
    # Test root & health
    r = root()
    assert r["status"] == "running"
    
    h = health()
    assert h["status"] == "ok"
    
    # Test create test resume
    create_res = await create_test_resume("unit-test-123")
    assert create_res["status"] == "completed"
    
    # Test get resume from storage
    resume_data = await get_resume("unit-test-123")
    assert resume_data["name"] == "Test User"
    assert "Python" in resume_data["skills"]
    
    # Test live ATS calculation
    req = LiveAtsRequest(resume_text="Alex Chen. Architected microservices with Python and Docker, reducing latency by 40%.")
    ats_res = await evaluate_live_ats(req)
    assert "ats_score" in ats_res
    assert ats_res["ats_score"] > 0
    
    print("✅ Endpoint handler tests passed!")


if __name__ == "__main__":
    test_storage()
    asyncio.run(async_test_endpoints())
    print("\n🎉 ALL STORAGE & API INTEGRATION TESTS PASSED SUCCESSFULLY!")
