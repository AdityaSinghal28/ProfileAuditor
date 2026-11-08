# Stakeholder Interview Questionnaire

**Project:** ProfileAuditor  
**Purpose:** Collect requirements before development
**Status:** Draft

**Stakeholder name:** ____________________
**Role:** ____________________
**Date:** ____________________

## Category 1: Recruiter or Hiring Manager

### 1. Open-ended: What problems do you face when reviewing technical resumes?

**Response:** Resume review takes time because project and skill claims are not always easy to verify. Different reviewers may also interpret the same information differently.

### 2. Multiple-choice: Which information should be shown first in the audit result?

**Selected responses:**

- [ ] Candidate skills and projects
- [ ] Verified and unverified claims
- [ ] Score and score explanation
- [ ] Personal information only
- [ ] Technical system details

### 3. Rating: How important is an explainable score from 1 to 5?

**Response:** 5 - Very important. A score is useful only when the reviewer can understand the evidence and factors behind it.

### 4. Scenario: If a candidate has no public GitHub profile, what should happen?

**Response:** The result should show that GitHub evidence is unavailable. It should not treat the missing profile as proof that the candidate lacks the claimed skills.

### 5. Ranking: Rank the most important recruiter features.

**Response:** 1. Clear verification results, 2. Score explanation, 3. Resume extraction, 4. ATS feedback, 5. Export options.

## Category 2: Technical Interviewer

### 6. Open-ended: What makes public evidence useful for checking a technical claim?

**Response:** Evidence is useful when a repository or coding activity matches the claimed skill or project. The result should show the reason for the match instead of only displaying a score.

### 7. Multiple-choice: Which evidence should be considered?

**Selected responses:**

- [x] Repository languages
- [x] Project descriptions
- [x] Repository activity
- [x] LeetCode problem-solving activity
- [ ] Number of social-media followers

### 8. Rating: How important is separating technical skills from soft skills from 1 to 5?

**Response:** 5 - Very important. Soft skills cannot be checked through GitHub or LeetCode in the same way as technical skills.

### 9. Scenario: What should happen when an external profile cannot be accessed?

**Response:** The system should show an unavailable or error status and allow the reviewer to continue with the other resume information. It should not silently mark the claim as false.

### 10. Ranking: Rank the most important technical requirements.

**Response:** 1. Correct claim matching, 2. Clear evidence references, 3. Separate skill categories, 4. Handling missing data, 5. Detailed score calculation.

## Category 3: Candidate and Project Guide

### 11. Open-ended: What would make the proposed system fair and useful for candidates?

**Response:** Candidates should be able to see what information was extracted, correct mistakes, and understand why a claim was marked unverified. The system should clearly state that public evidence may be incomplete.

### 12. Multiple-choice: Which candidate features should be included?

**Selected responses:**

- [x] Review extracted resume information
- [x] Correct extracted details
- [x] Receive ATS feedback
- [x] Export the improved resume
- [ ] Receive an automatic hiring decision

### 13. Rating: How important is resume editing and feedback from 1 to 5?

**Response:** 4 - Important. Candidates need practical suggestions about missing keywords, unclear sections, and resume formatting.

### 14. Scenario: What should the system do if the resume parser extracts incorrect information?

**Response:** It should show the extracted information for review and allow the user to correct it before verification. The corrected information should be used for the remaining analysis.

### 15. Ranking: Rank the main project priorities.

**Response:** 1. Correct and understandable results, 2. Resume upload and extraction, 3. Technical verification, 4. ATS feedback, 5. DOCX export.

## Summary of Requirements

- Main problem: Technical resume claims are time-consuming and inconsistent to verify.
- Main user need: Clear evidence, explanations, and correction options.
- Highest priority: Accurate extraction and understandable verification results.
- Important limitation: Public evidence may be missing, incomplete, or unavailable.
- Ethical requirement: The system must support human judgment and must not make automatic hiring decisions.
