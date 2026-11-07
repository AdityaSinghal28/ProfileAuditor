# ProfileAuditor Problem Selection and Feasibility Study

**Project:** ProfileAuditor  
**Version:** 1.0  
**Date:** 2026-09-23  
**Status:** Draft for review

## 1. Problem Statement

Recruiters and technical interviewers often rely on resume claims that are difficult to verify quickly. Manually checking projects, programming skills, and coding activity takes time and may produce different results for different reviewers. Candidates also receive limited feedback about resume quality and missing job requirements.

The proposed ProfileAuditor system would address this problem by extracting resume information, comparing technical claims with available GitHub and LeetCode evidence, calculating a Reality Score, and providing ATS and role-fit feedback.

## 2. Evidence and Current Situation

- Resume review is frequently manual and time-consuming.
- Project names and skill lists do not always provide evidence of actual technical work.
- GitHub and LeetCode data can provide useful supporting evidence, but availability varies.
- A score should be explained and should not replace human judgment.
- A proposed system could combine resume parsing, public-profile verification, scoring, ATS analysis, and role-fit analysis in one workflow.
- The initial version would focus on demonstrating the main workflow with sample resumes.

## 3. Problem Alternatives Considered

| Alternative | Description | Strengths | Weaknesses |
|---|---|---|---|
| A1: Continue manual review | Review resumes and public profiles independently. | No development cost; human judgment remains central. | Slow and inconsistent. |
| A2: ATS checker only | Compare resume text with a job description. | Simple and useful for editing feedback. | Does not verify technical claims. |
| A3: ProfileAuditor | Parse resumes, check public technical evidence, calculate scores, and provide feedback. | Combines verification and resume improvement. | Evidence may be incomplete or unavailable. |
| A4: Full ATS integration | Build a complete recruiting platform with workflow integrations. | Useful for a larger future system. | Outside the scope of this academic project. |

## 4. Selected Problem and Proposed Solution

**Selected problem:** Reduce the time and inconsistency involved in reviewing technical resume claims while giving candidates useful resume feedback.

**Proposed solution:** Develop ProfileAuditor as a human-assisted audit tool that:

1. Accepts PDF and DOCX resumes.
2. Extracts structured candidate information.
3. Checks technical claims against available GitHub and LeetCode evidence.
4. Shows verified, unverified, and unavailable evidence separately.
5. Calculates an explainable Reality Score.
6. Provides ATS health and optional role-fit analysis.
7. Allows resume editing and DOCX export.

## 5. Feasibility Study

### 5.1 Technical Feasibility

**Assessment: Feasible for the proposed academic project.**

The proposed system can be implemented using a React frontend and FastAPI backend. Suitable libraries and public APIs are available for PDF/DOCX parsing, GitHub and LeetCode checks, scoring, ATS analysis, and DOCX conversion. The main workflow is technically achievable for an academic project.

**Technical limitations:**

- The initial version can use temporary or simple local storage for demonstration.
- Results depend on the availability of GitHub and LeetCode data.
- Resume extraction may require user correction.
- Missing public evidence must be shown as unavailable, not as proof that a claim is false.

### 5.2 Operational Feasibility

**Assessment: Feasible for a demonstration and controlled evaluation.**

The workflow is simple: upload a resume, process its contents, verify available evidence, and display the results. A reviewer can inspect the extracted data and score before making any decision.

**Operational requirements:**

- Show clear upload, processing, error, and results states.
- Explain which information was verified and which was unavailable.
- Allow manual review of extracted data and generated scores.

### 5.3 Economic Feasibility

**Assessment: Feasible at student-project scale.**

The Python and React stack and available open-source libraries can keep development cost low. The project can be demonstrated locally using public APIs and sample data.

| Cost area | Project approach | Cost consideration |
|---|---|---|
| Hosting | Local Docker setup | No hosting cost for demonstration |
| Storage | Simple local or temporary storage | Permanent storage is outside the initial scope |
| Verification | Public GitHub and LeetCode data | API availability may vary |
| Scoring | Rule-based scoring | No additional software cost |
| Email | Optional email service | Not required for the core demonstration |

### 5.4 Ethical Feasibility

**Assessment: Feasible with basic safeguards.**

Resume data and public profile information may be incomplete or incorrectly attributed. The system should present verification as supporting evidence, not as a final judgment about a candidate.

**Required safeguards:**

- Do not claim that an unverified item is false.
- Treat missing public data as unknown.
- Separate technical evidence from soft-skill assessment.
- Do not use the score as an automatic rejection decision.
- Do not expose unnecessary personal information in demonstration logs.

### 5.5 Schedule Feasibility

**Assessment: Feasible within an academic project schedule.**

| Stage | Main outcome |
|---|---|
| Stage 1 | Identify the problem and collect stakeholder requirements. |
| Stage 2 | Design the UML diagrams, architecture, and database schema. |
| Stage 3 | Implement upload, parsing, verification, scoring, and results modules. |
| Stage 4 | Test the workflow with sample resumes and document the results. |

## 6. Feasibility Decision

**Decision:** Proceed with the ProfileAuditor academic project.

The problem is meaningful, suitable technologies are available, and the proposed workflow is achievable within the academic project scope. Permanent storage and advanced deployment features are outside the initial scope.

## 7. Success Measures

- The main upload-to-results workflow completes successfully.
- Technical claims are clearly marked as verified, unverified, or unavailable.
- The score has an understandable component breakdown.
- Users can identify and correct extraction issues.
- The system does not present the score as a replacement for human judgment.

## 8. Recommendation and Next Actions

1. Conduct interviews using [Stakeholder_Interview_Questionnaire.md](Stakeholder_Interview_Questionnaire.md).
2. Confirm how missing public profiles and soft skills should be displayed.
3. Finalize the requirements, UML diagrams, architecture, and relational schema.
4. Test the main workflow using representative sample resumes.
5. Update the SRS and project charter based on stakeholder feedback.
