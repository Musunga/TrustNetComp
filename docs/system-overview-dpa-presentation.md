# TrustNetComp — System Overview
*Prepared as source material for a presentation to the Data Protection Commission*

## 1. Executive Summary

TrustNetComp is a compliance management platform that helps organisations in Zambia (and beyond) achieve and maintain compliance with regulatory and industry frameworks — including the **Data Protection Act No. 3 of 2021 (ZDPA)** — through a combination of self-service software and expert-assisted assessment. It replaces spreadsheet-based, manual compliance tracking with a structured, evidence-backed, auditable workflow, and pairs it with an AI assistant that explains legal requirements in plain language grounded in the actual legislation.

## 2. The Problem It Solves

Organisations subject to the Data Protection Act — and to sector-specific frameworks such as the Bank of Zambia Cyber Security Framework — typically struggle with:

- **Fragmented compliance work**: requirements tracked in disconnected spreadsheets, emails, and documents, with no single source of truth.
- **Unclear ownership**: no clear record of who is responsible for which control, or evidence of work done.
- **Opaque progress**: management and auditors cannot easily see how compliant the organisation actually is, or where the gaps are.
- **Expertise gap**: smaller organisations often lack in-house legal/compliance expertise to interpret what a given control or provision actually requires of them.
- **No audit trail**: when a regulator or auditor asks "prove you did this," there is often no structured evidence trail.

## 3. What TrustNetComp Is

A multi-tenant web platform where a company:

1. Creates a workspace and invites its team.
2. Selects the compliance framework(s) relevant to it (e.g. Zambia Data Protection Act, ISO 27001, PCI DSS, SOC 2, Bank of Zambia Cyber Security Framework).
3. Works through that framework's controls — organised into **functions → control areas → individual controls** — either itself or with TrustNetComp's assisted-assessment service.
4. Tracks progress, assigns work to team members, uploads evidence per control.
5. Submits the completed assessment for review and receives a certificate once approved.

Everything is scoped per-company, per-framework, per-assessment-year, so an organisation can run multiple frameworks (e.g. ZDPA *and* ISO 27001) side by side and see a unified compliance picture.

## 4. Who Uses It

- **Company Administrators** — manage their organisation's workspace, select frameworks, invite team members, oversee overall compliance posture.
- **Team Members** — are assigned specific controls to work on and upload supporting evidence.
- **TrustNetComp Technical Review Team** — a specialist internal team that handles *assisted assessments*: where a company opts to have TrustNetComp's own compliance technical staff take a framework enrolment forward on their behalf, including physical/on-site inspection where relevant, and reviews submissions before certification.

## 5. Core Capabilities

### 5.1 Multi-Framework Compliance Management
Supports multiple frameworks concurrently, including:
- **Zambia Data Protection Act (ZDPA No. 3 of 2021)**
- Bank of Zambia Cyber Security Framework (BOZ CSF)
- ISO/IEC 27001 (Information Security Management)
- SOC 2 Type II
- PCI DSS (Payment Card Industry Data Security Standard)

Each framework is broken down into its constituent functions, control areas, and individual controls, so compliance work is granular and traceable rather than a single "yes/no" checkbox.

### 5.2 Assessment & Control Workflow
- A company enrols in a framework for a given year, creating an **assessment**.
- Progress is tracked at the control level and rolled up to an overall completion percentage.
- Controls can be **assigned to specific team members**, with visibility into who owns what.
- **Evidence upload** is built into each control, so compliance claims are backed by supporting documentation rather than self-attestation alone.
- Once all required work is complete, the assessment can be **submitted for review**.

### 5.3 Assisted Assessment (Expert-Led Track)
For organisations that prefer not to run the assessment themselves, TrustNetComp offers an assisted-assessment path: the company requests it for a given framework enrolment, and TrustNetComp's technical team takes the assessment forward — gathering evidence through physical (on-site) engagement and remote communication as appropriate — before it proceeds to review. This is explicitly framed to the company as still being subject to the same official approval and audit process as self-service assessments.

### 5.4 Review & Certification
Completed assessments go through a review pipeline. Once approved, the organisation receives a **certificate** tied to that framework and assessment year, which can be viewed and referenced from within the platform.

### 5.5 AI Compliance Assistant
An in-platform AI assistant ("Ask TrustNet") lets any user ask plain-language questions about a framework or requirement and get an answer grounded in the actual legal text — for example, correctly citing the specific section of the Data Protection Act that governs consent, rather than giving generic advice. This is aimed at closing the expertise gap for organisations without dedicated legal/compliance staff, while keeping guidance traceable to source legislation.

### 5.6 Team & Access Management
- Role-based access (company administrators vs. general team members vs. TrustNetComp technical reviewers).
- Member invitation via email, with status tracking (active / invited / suspended).
- Per-company scoping, so data and progress from one organisation is never visible to another.

### 5.7 Reporting
- Per-assessment compliance reports summarising control-level status, completion, and maturity.
- Framework preview (so a company can review a framework's full control set before committing to it).
- Dashboard-level visibility into pending tasks, team composition, and framework status at a glance.

## 6. How This Supports the Data Protection Commission's Mandate

- **Operationalises the Act, not just references it**: the platform doesn't just point organisations at the ZDPA text — it turns its provisions into a structured checklist of controls with owners, evidence, and status, driving from provision to demonstrable compliance.
- **Creates an audit trail by design**: evidence attached at the control level and a review/certification workflow mean an organisation's compliance posture is documented and verifiable, not just claimed.
- **Reduces the compliance expertise barrier**: smaller data controllers/processors — who may not be able to afford dedicated legal counsel — get grounded, legislation-referenced guidance through the AI assistant and, where needed, expert-assisted assessment.
- **Scales oversight**: by standardising how organisations self-assess against the Act, it creates the kind of consistent, structured compliance artefacts that make third-party or regulatory review more tractable than ad hoc, per-organisation documentation.
- **Multi-framework context**: because ZDPA compliance sits alongside frameworks like ISO 27001 and BOZ CSF in the same platform, organisations are encouraged to treat data protection as part of a holistic risk and security posture rather than an isolated compliance exercise.

## 7. Security & Access Posture (Platform Itself)

- Authenticated sessions are managed via encrypted, signed session cookies, separate from the bearer tokens used for API access.
- Role-based access control distinguishes company administrators, general members, and TrustNetComp's internal technical review staff.
- All company data (assessments, members, evidence, wallet/billing) is scoped per-company; users only see workspaces they belong to.
- The platform enforces framework-level and control-level workflows through the backend, not just the UI, so status/progress can't be spoofed client-side.

## 8. Illustrative User Journey

1. A financial services company signs up and creates its workspace.
2. The compliance officer selects "Zambia Data Protection Act" and "Bank of Zambia Cyber Security Framework" as their two frameworks for the year.
3. They invite three team members and assign them specific control areas (e.g. one owns consent management controls, another owns data retention controls).
4. Each team member uploads evidence as they complete their assigned controls — policies, screenshots, signed records.
5. When unsure what a control actually requires, a team member asks the AI assistant, which explains it in plain language with reference to the specific section of the Act.
6. Once all controls are complete, the compliance officer submits the assessment for review.
7. TrustNetComp's technical review team verifies the submission and issues a certificate.
8. The company's dashboard now shows a documented, evidenced, certified compliance status for that framework and year — which can be shown to auditors, partners, or regulators on request.

## 9. Suggested Presentation Structure (Slide-by-Slide)

1. **Title** — TrustNetComp: Operationalising Data Protection Compliance
2. **The Problem** — why compliance is hard today (fragmented, manual, unauditable)
3. **What TrustNetComp Is** — one-paragraph platform summary + screenshot of the dashboard
4. **How It Works** — the assessment workflow (select framework → assign controls → evidence → review → certify), as a simple flow diagram
5. **Frameworks Supported** — including a dedicated callout for the Zambia Data Protection Act
6. **Deep Dive: Data Protection Act Support** — control-by-control breakdown example, AI assistant citing a real section of the Act
7. **Assisted Assessment** — how organisations without in-house expertise are supported
8. **Audit Trail & Evidence** — screenshot of evidence upload / compliance report
9. **Access Control & Data Governance** — how the platform itself protects data
10. **Value to the Commission** — consistent, structured, verifiable compliance artefacts at scale
11. **Roadmap / Ask** — what you want from the Commission (endorsement, pilot partnership, feedback on framework mapping, etc. — fill in based on your actual goals for the meeting)
12. **Closing / Contact**

## 10. Ready-to-Use Prompt for a PPT-Generation Tool

> Create a professional, formal presentation (10–12 slides) for a meeting with a national Data Protection Commission, introducing "TrustNetComp," a compliance management platform. Use a clean, corporate design with a blue/navy colour palette. Base the content strictly on the following system overview: [paste the contents of this document here]. Follow the slide structure in Section 9 of the document. Keep slide text concise (bullet points, not paragraphs) and reserve detailed explanation for speaker notes. Emphasise how the platform operationalises the Data Protection Act specifically — turning legal provisions into trackable, evidenced controls — and include one slide with a concrete example of the AI assistant answering a question grounded in the actual Act text. Tone: professional, precise, non-salesy — this is a regulatory audience, not a sales pitch.

---
*This document was generated from a direct review of the TrustNetComp codebase and product behaviour. Figures, org details (company name, meeting goals, roadmap "ask") should be confirmed/filled in before presenting.*
