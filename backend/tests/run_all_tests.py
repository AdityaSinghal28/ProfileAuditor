"""
Unified test runner for ProfileAuditor backend.
Runs all backend test suites sequentially and reports summary.
"""

import sys
import os
import subprocess

def run_suite(name: str, script_name: str) -> bool:
    print(f"\n{'='*70}\nRUNNING SUITE: {name} ({script_name})\n{'='*70}")
    script_path = os.path.join(os.path.dirname(__file__), script_name)
    result = subprocess.run([sys.executable, script_path])
    if result.returncode == 0:
        print(f"✅ SUITE PASSED: {name}")
        return True
    else:
        print(f"❌ SUITE FAILED: {name} (exit code: {result.returncode})")
        return False

def main():
    print("🚀 Running ProfileAuditor Backend Test Suites...\n")
    
    suites = [
        ("Storage Decoupling & API Endpoints", "test_storage_and_api.py"),
        ("Project Matching & Verification", "test_project_matching.py"),
        ("Comprehensive Multi-Candidate & Scoring Pipeline", "test_comprehensive.py"),
    ]
    
    results = []
    for name, script in suites:
        success = run_suite(name, script)
        results.append((name, success))
        
    print(f"\n{'='*70}\nOVERALL TEST SUITE SUMMARY\n{'='*70}")
    all_passed = True
    for name, success in results:
        status = "PASSED" if success else "FAILED"
        print(f"  [{status}] {name}")
        if not success:
            all_passed = False
            
    if all_passed:
        print("\n🎉 ALL TEST SUITES PASSED CLEANLY!")
        sys.exit(0)
    else:
        print("\n❌ SOME TEST SUITES FAILED.")
        sys.exit(1)

if __name__ == "__main__":
    main()

