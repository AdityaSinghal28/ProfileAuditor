# ProfileAuditor UML Diagrams

## Introduction

Unified Modeling Language (UML) diagrams are used to describe the proposed ProfileAuditor system before development. They provide a simple visual view of the users, system activities, main classes, and communication between system parts.

The following diagrams are included:

1. **Use case diagram:** Shows the users and the functions they expect from the system.
2. **Class diagram:** Shows the main data classes and their relationships.
3. **Activity diagram:** Shows the steps followed during a resume audit.
4. **Sequence diagram:** Shows the order of communication during an audit.

These diagrams are design models for the proposed academic project. They are not implementation diagrams.

## 1. Use Case Diagram

```mermaid
flowchart LR
    recruiter[Recruiter / Interviewer]
    candidate[Candidate]
    github[GitHub]
    leetcode[LeetCode]

    subgraph System[ProfileAuditor System]
        upload((Upload resume))
        extract((Extract resume information))
        correct((Review and correct information))
        verify((Verify technical claims))
        score((Calculate Reality Score))
        feedback((View ATS feedback))
        edit((Edit resume))
        export((Export resume))
    end

    recruiter --> upload
    recruiter --> verify
    recruiter --> score
    recruiter --> feedback
    candidate --> upload
    candidate --> correct
    candidate --> edit
    candidate --> export

    upload --> extract
    extract --> correct
    correct --> verify
    verify --> github
    verify --> leetcode
    verify --> score
    score --> feedback
    edit --> export
```

### Explanation

The recruiter or interviewer reviews the audit results. The candidate provides or corrects resume information. GitHub and LeetCode are external sources that may provide supporting evidence.

## 2. Class Diagram

```mermaid
classDiagram
    class Resume {
        +resumeId
        +name
        +email
        +skills
        +projects
        +education
        +experience
        +githubUsername
        +leetcodeUsername
    }

    class VerificationResult {
        +verifiedSkills
        +unverifiedSkills
        +verifiedProjects
        +unavailableEvidence
    }

    class Score {
        +realityScore
        +skillsScore
        +projectsScore
        +evidenceSummary
    }

    class ATSFeedback {
        +missingKeywords
        +formattingSuggestions
        +roleFitComments
    }

    class User {
        +userId
        +name
        +role
    }

    User --> Resume : submits
    Resume --> VerificationResult : is checked
    VerificationResult --> Score : contributes to
    Resume --> ATSFeedback : receives
    Score --> ATSFeedback : supports review
```

### Explanation

The `Resume` class stores the information extracted from a document. `VerificationResult` stores the evidence found for skills and projects. `Score` represents the calculated result, while `ATSFeedback` contains suggestions for improving the resume.

## 3. Activity Diagram

```mermaid
flowchart TD
    start([Start]) --> upload[Upload PDF or DOCX resume]
    upload --> valid{File valid?}
    valid -->|No| error[Show error message]
    error --> finish([End])
    valid -->|Yes| extract[Extract resume information]
    extract --> review[User reviews information]
    review --> verify[Check available technical evidence]
    verify --> classify[Classify claims as verified, unverified, or unavailable]
    classify --> score[Calculate Reality Score]
    score --> feedback[Show score and ATS feedback]
    feedback --> edit{Edit resume?}
    edit -->|Yes| update[Edit resume content]
    update --> export{Export resume?}
    edit -->|No| finish
    export -->|Yes| download[Download edited DOCX]
    export -->|No| finish
    download --> finish
```

### Explanation

The activity begins when a user uploads a resume. The system validates and extracts the information, allows the user to review it, checks available evidence, and displays the score and feedback. The user may then edit and export the resume.

## 4. Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Interface as User Interface
    participant System as ProfileAuditor System
    participant GitHub
    participant LeetCode

    User->>Interface: Upload resume
    Interface->>System: Send resume file
    System->>System: Extract resume information
    System-->>Interface: Display extracted information
    User->>Interface: Confirm or correct information
    Interface->>System: Start verification
    System->>GitHub: Request available project evidence
    GitHub-->>System: Return GitHub evidence
    System->>LeetCode: Request available coding evidence
    LeetCode-->>System: Return LeetCode evidence
    System->>System: Classify claims and calculate score
    System-->>Interface: Return score and feedback
    Interface-->>User: Display audit result
```

### Explanation

The sequence diagram shows the order of communication between the user interface, the proposed system, and the external public-profile sources. The system processes the resume, requests available evidence, calculates the result, and displays the feedback.

## Conclusion

These UML diagrams provide a basic design of the proposed ProfileAuditor system. They describe the required users, activities, classes, and interactions before implementation begins. The diagrams can be refined after stakeholder requirements are approved.
