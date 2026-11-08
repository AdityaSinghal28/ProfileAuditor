# Software Requirements Specification

## ProfileAuditor

**Version:** 1.0  
**Status:** Draft for stakeholder approval
**Project stage:** Before development

## 1. Introduction

### 1.1 Purpose

This document defines the requirements for the proposed ProfileAuditor system. The system is intended to help users review technical resumes, organize supporting evidence, and improve resume quality.

### 1.2 Problem Statement

Reviewing technical resumes manually can take time and may produce inconsistent results. Skills and project claims are not always easy to verify, and candidates may not receive clear feedback about their resumes.

### 1.3 Objectives

The proposed system should:

- Reduce the time needed to review technical resume claims.
- Extract important information from PDF and DOCX resumes.
- Compare selected claims with available public evidence.
- Show clear explanations instead of only displaying a score.
- Provide ATS feedback and allow resume improvement.
- Support human judgment instead of making automatic hiring decisions.

## 2. Stakeholders and Users

| Stakeholder | Expected use |
|---|---|
| Recruiter or hiring manager | Review resume information and audit results. |
| Technical interviewer | Examine evidence related to technical skills and projects. |
| Candidate | Correct extracted information and improve the resume. |
| Project guide | Review the project scope and requirements. |

## 3. Scope

### 3.1 Included in the Proposed System

- PDF and DOCX resume upload.
- Extraction of resume text and important fields.
- User review and correction of extracted information.
- GitHub and LeetCode evidence checking.
- Separate display of verified, unverified, and unavailable claims.
- Reality Score with a simple explanation.
- ATS feedback and resume editing.
- DOCX export of edited resume content.

### 3.2 Outside the Proposed Scope

- Automatic candidate selection or rejection.
- Complete applicant tracking system.
- Ranking a large collection of candidates.
- Guaranteed proof of identity or authorship.
- Checking every social-media platform.

## 4. Functional Requirements

### 4.1 Resume Processing

| ID | Requirement |
|---|---|
| FR-01 | The system shall accept PDF and DOCX resume files. |
| FR-02 | The system shall reject unsupported files with a clear message. |
| FR-03 | The system shall extract name, contact details, education, experience, skills, projects, and public-profile usernames when available. |
| FR-04 | The system shall allow the user to review and correct extracted information. |

### 4.2 Technical Verification

| ID | Requirement |
|---|---|
| FR-05 | The system shall compare selected technical skills and projects with available GitHub and LeetCode evidence. |
| FR-06 | The system shall display verified, unverified, and unavailable claims separately. |
| FR-07 | The system shall show a short explanation for the verification result. |
| FR-08 | The system shall treat missing public evidence as unknown rather than proof that a claim is false. |

### 4.3 Scoring and Feedback

| ID | Requirement |
|---|---|
| FR-09 | The system shall calculate a Reality Score after the verification step. |
| FR-10 | The system shall display the score with a basic breakdown of its factors. |
| FR-11 | The system shall provide ATS feedback about resume content and structure. |
| FR-12 | The system should compare the resume with a job description when one is provided. |

### 4.4 Resume Improvement

| ID | Requirement |
|---|---|
| FR-13 | The system shall allow the user to edit resume content. |
| FR-14 | The system shall update ATS feedback for edited content. |
| FR-15 | The system shall export the improved resume as a DOCX file. |

### 4.5 User Messages

| ID | Requirement |
|---|---|
| FR-16 | The system shall show progress while a resume or public profile is being processed. |
| FR-17 | The system shall show a clear message when processing fails or public information is unavailable. |
| FR-18 | The system shall state that the result supports human review and is not a final hiring decision. |

## 5. Non-Functional Requirements

- The interface should be simple enough for a first-time user.
- Results should use clear language and explain important limitations.
- The system should handle a normal resume within a reasonable waiting time.
- Personal resume information should be handled carefully and should not be unnecessarily exposed.
- The system should continue showing resume results when one public data source is unavailable.
- The main modules should be separated into resume processing, verification, scoring, and feedback responsibilities.

## 6. Main Use Case: Audit a Technical Resume

**Primary users:** Recruiter, technical interviewer, or candidate

**Precondition:** The user has a PDF or DOCX resume.

**Main flow:**

1. The user uploads a resume.
2. The system validates the file and extracts information.
3. The user reviews and corrects the extracted information.
4. The system checks available GitHub and LeetCode evidence.
5. The system displays verified, unverified, and unavailable claims.
6. The system calculates and displays the Reality Score.
7. The system provides ATS and optional role-fit feedback.
8. The user reviews the result and may edit and export the resume.

**Alternative flow:** If public evidence is unavailable, the system displays an unavailable status and continues with the available resume information.

## 7. Data Requirements

The proposed system should work with these main data groups:

- **Resume:** contact details, education, experience, skills, projects, and public-profile usernames.
- **Verification result:** verified claims, unverified claims, unavailable information, and explanations.
- **Score result:** Reality Score and score breakdown.
- **ATS result:** resume observations and improvement suggestions.

## 8. Assumptions and Limitations

- Users provide resumes they are allowed to submit.
- Public GitHub and LeetCode information may not be available for every candidate.
- Resume formatting may affect extraction accuracy.
- The Reality Score is a supporting indicator and not a final employment decision.
- Stakeholders will review the scoring rules before development begins.

## 9. Acceptance Criteria

The requirements will be considered satisfied when the proposed system can:

- Accept a valid PDF or DOCX resume.
- Display extracted resume information for user review.
- Separate verified, unverified, and unavailable claims.
- Display a Reality Score with a basic explanation.
- Provide ATS feedback for the resume.
- Allow correction and editing of resume content.
- Export edited content as a readable DOCX file.
- Show clear limitations and require human judgment.

## 10. Open Questions for Stakeholder Approval

1. Which skills and projects should have the greatest effect on the Reality Score?
2. How should missing GitHub or LeetCode profiles be displayed?
3. Which ATS suggestions are most useful to candidates?
4. Should PDF export be included along with DOCX export?
5. Which features should be postponed to future work?
