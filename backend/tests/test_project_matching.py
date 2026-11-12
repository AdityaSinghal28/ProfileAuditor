import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.services.github_service import verify_projects

def test_project_matching():
    test_projects = [
        {"name": "Questfi"},
        {"name": "Data Roots"},
        {"name": "Profile Auditor"}
    ]

    test_repos = [
        {"name": "Questfi-Vietbuild", "description": "Blockchain bounty platform"},
        {"name": "ProfileAuditor", "description": "Resume verification app"},
        {"name": "data-roots", "description": "Decentralized data sharing platform"},
        {"name": "some-other-repo", "description": "Unrelated repository"},
        {"name": "questfi", "description": "Alternative questfi repo"},
    ]

    verified_projects, proof = verify_projects(test_projects, test_repos)
    assert set(verified_projects) == {"Questfi", "Data Roots", "Profile Auditor"}
    assert "Questfi" in proof
    assert "Data Roots" in proof
    assert "Profile Auditor" in proof

if __name__ == "__main__":
    test_project_matching()
    print("✅ Project matching tests passed!")
