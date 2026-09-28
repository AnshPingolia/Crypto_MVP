# Business Requirements Document
## [Product Name]
### [Organisation / Ministry / Department]

---

> **Document version:** 1.0
> **Status:** Draft / In Review / Approved
> **Date:** [DD Month YYYY]
> **Prepared by:** [Name, Role]
> **Last updated:** [DD Month YYYY]
> **Reviewed by:** [Names]
> **Approved by:** [Name, Role]

---

## DOCUMENT CONTROL

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | | | Initial draft |
| 1.0 | | | Approved for design |

---

## TABLE OF CONTENTS

1. [Product Overview](#1-product-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Users & Personas](#4-users--personas)
5. [User Journeys](#5-user-journeys)
6. [Scope — Page & Screen Inventory](#6-scope--page--screen-inventory)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Content Requirements](#9-content-requirements)
10. [Integration Requirements](#10-integration-requirements)
11. [Design & Brand Requirements](#11-design--brand-requirements)
12. [Accessibility Requirements](#12-accessibility-requirements)
13. [Constraints](#13-constraints)
14. [Risks](#14-risks)
15. [Open Questions](#15-open-questions)
16. [Timeline & Milestones](#16-timeline--milestones)
17. [Appendix](#17-appendix)

---

## 1. PRODUCT OVERVIEW

### 1.1 Product Identity

| Field | Value |
|-------|-------|
| **Product name** | |
| **Parent organisation** | |
| **Ministry / department** | |
| **Product type** | *(citizen-facing portal / internal tool / recruitment platform / service delivery / dashboard / e-commerce / informational site — pick one)* |
| **Primary URL / domain** | |
| **Launch type** | *(New product / Revamp of existing / Migration from legacy)* |
| **If revamp — replacing** | *(URL and description of existing product)* |

### 1.2 Product Purpose

**One sentence — what this product does:**

> [Write here]

**What problem it solves:**

> [Write here]

**What happens if this product does not exist (the stakes):**

> [Write here]

### 1.3 Geographic & Regulatory Scope

| Field | Value |
|-------|-------|
| **Geographic scope** | *(National / State: [name] / City: [name] / Internal to organisation)* |
| **Regulatory frameworks** | *(e.g. GIGW 3.0, WCAG 2.1 AA, CERT-In, MeitY web policy, NIC hosting policy, RTI obligations, data localisation)* |
| **Government scheme / programme** | *(If applicable — scheme name and reference)* |
| **Must align with** | *(e.g. UX4G Design System, National Language Policy, Digital India guidelines)* |

---

## 2. PROBLEM STATEMENT

### 2.1 Current Situation

*Describe the current state — what exists today, how users currently accomplish the task, and what the experience is like. If this is a revamp, include a brief audit of what is broken.*

> [Write here]

### 2.2 Pain Points

*List every specific pain point affecting each user type. Be precise — "slow" is not useful; "application form times out after 10 minutes causing users to lose all data" is useful.*

| User | Pain Point | Severity (High/Med/Low) |
|------|-----------|------------------------|
| | | |
| | | |

### 2.3 Root Causes

*Why do these pain points exist? (e.g. legacy system constraints, no mobile design, missing content, broken journey, inaccessible UI)*

> [Write here]

### 2.4 Opportunity

*What becomes possible if these problems are solved?*

> [Write here]

---

## 3. GOALS & SUCCESS METRICS

### 3.1 Goals

| # | Goal | Why it matters |
|---|------|---------------|
| 1 | | |
| 2 | | |
| 3 | | |

### 3.2 Success Metrics

*Every metric must have a baseline (even if estimated) and a target. A metric without a baseline cannot be measured.*

| Metric | Baseline | Target | Measurement method |
|--------|----------|--------|--------------------|
| | | | |
| | | | |

### 3.3 Anti-Goals

*What this product is explicitly NOT trying to do. This prevents scope creep and helps the design team say no.*

- [Anti-goal 1]
- [Anti-goal 2]

---

## 4. USERS & PERSONAS

> **Instructions for each persona:**
> Be specific. Vague personas produce vague designs.
> One persona = one real type of person with one dominant goal.
> Do not combine two very different users into one persona.

### Persona 1 — [Name] *(Primary User)*

| Field | Detail |
|-------|--------|
| **Name** | |
| **Age range** | |
| **Location** | *(City / Tier 1 / Tier 2 / Tier 3 / Rural)* |
| **Primary device** | *(Smartphone only / Laptop + phone / Desktop only)* |
| **Device model (if relevant)** | *(e.g. entry-level Android, ~2GB RAM)* |
| **Network conditions** | *(4G mobile / broadband / low-bandwidth / intermittent)* |
| **Language** | *(Primary language + any secondary)* |
| **Digital literacy** | *(First-time internet user / Moderate / Tech-savvy)* |
| **Education** | |
| **Occupation** | |
| **Primary goal on this product** | |
| **Secondary goals** | |
| **Emotional state when using** | *(Anxious / Hopeful / Transactional / Exploratory / Under time pressure)* |
| **What success looks like for them** | |
| **Current workaround** | *(How they accomplish this task today without the product)* |
| **Key frustrations (current)** | |
| **Accessibility needs** | *(None stated / Low vision / Motor impairment / Screen reader user / etc.)* |

**Quote (representative of their mindset):**
> "[A sentence this person might actually say about their goal or frustration]"

---

### Persona 2 — [Name]

*(Repeat table above)*

---

### Persona 3 — [Name] *(Admin / Operator — if applicable)*

| Field | Detail |
|-------|--------|
| **Name** | |
| **Role / title** | |
| **Primary device** | |
| **Primary goal** | *(e.g. publish notifications, review applications, generate reports)* |
| **How often they use this product** | |
| **Technical proficiency** | |
| **Key frustrations (current)** | |

---

### Persona Summary

| Persona | Device | Language | Literacy | Primary Goal | Priority |
|---------|--------|----------|----------|-------------|----------|
| | | | | | P1 |
| | | | | | P2 |
| | | | | | P3 |

**Primary persona** (whose needs override all others when there is a conflict):

> [Name and one sentence justification]

**Most extreme accessibility need** (sets the accessibility design floor):

> [Persona name and specific need]

---

## 5. USER JOURNEYS

> **Instructions:**
> A journey is a sequence of steps a user takes to accomplish a goal.
> Map every major task the product must support.
> P1 = most critical, must work perfectly at launch.
> P2 = important, should work at launch.
> P3 = supporting, can be simplified at launch.

### Journey 1 — [Journey Name] *(P1)*

| Field | Detail |
|-------|--------|
| **Persona** | |
| **Goal** | |
| **Entry point** | *(Homepage / Direct URL / Notification link / Search result / External referral)* |
| **Trigger** | *(What causes the user to start this journey)* |
| **Exit point** | *(Confirmation / Download / Dashboard / Redirect)* |
| **What the user must feel at the end** | *(Confident / Reassured / Accomplished / Informed)* |

**Steps:**

| Step # | User action | System response | What can go wrong | Designed recovery |
|--------|-------------|-----------------|-------------------|-------------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

**Happy path summary (one sentence):**
> [e.g. "User checks eligibility, finds their scheme, starts and submits application, receives confirmation."]

---

### Journey 2 — [Journey Name] *(P2)*

*(Repeat table above)*

---

### Journey 3 — [Journey Name] *(P3)*

*(Repeat table above)*

---

## 6. SCOPE — PAGE & SCREEN INVENTORY

> **Instructions:**
> List every page and screen in scope.
> Be exhaustive — every page must appear here.
> If a page is NOT listed here, it will not be designed.
> Include all states: loading, empty, error, success.

### 6.1 Sitemap

```
/ (Home)
├── /[section-1]/
│   ├── /[section-1]/[page-1]
│   └── /[section-1]/[page-2]
├── /[section-2]/
│   └── /[section-2]/[page-1]
└── /[section-3]
```

### 6.2 Page Inventory

| Page name | Route path | Page type | Primary persona | Device priority | Primary CTA | BRD req. IDs |
|-----------|-----------|-----------|----------------|----------------|-------------|--------------|
| Home | / | Landing | | Mobile | | |
| | | | | | | |
| | | | | | | |

**Page types reference:**
`landing` / `form-step` / `detail` / `list` / `dashboard` / `confirmation` / `tracker` / `empty-state` / `error` / `settings` / `admin`

### 6.3 States Inventory

For each page that fetches or mutates data, list every state that must be designed:

| Page | Loading | Empty | Error | Partial data | Success | Notes |
|------|---------|-------|-------|-------------|---------|-------|
| | ✓ | ✓ | ✓ | | ✓ | |

### 6.4 Out of Scope

*Explicitly list everything this product will NOT include. This is as important as the scope list.*

- [Item 1 — and why it is out of scope]
- [Item 2]

---

## 7. FUNCTIONAL REQUIREMENTS

> **Instructions:**
> Every requirement gets an ID. IDs never change, even if requirements move or are deleted.
> Format: `FR-[CATEGORY]-[NUMBER]`
> Categories: `NAV` navigation / `FORM` forms / `AUTH` authentication /
> `SEARCH` search / `NOTIFY` notifications / `DATA` data display /
> `FILE` file handling / `PAY` payment / `TRACK` tracking /
> `CMS` content management / `I18N` multilingual / `A11Y` accessibility

### 7.1 Navigation

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-NAV-01 | | Must-have | |
| FR-NAV-02 | | | |

### 7.2 Forms & Input

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-FORM-01 | | Must-have | |

### 7.3 Authentication & Sessions

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-AUTH-01 | | Must-have | |

### 7.4 Search

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-SEARCH-01 | | | |

### 7.5 Notifications & Alerts

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-NOTIFY-01 | | | |

### 7.6 Data Display

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-DATA-01 | | | |

### 7.7 File Handling

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-FILE-01 | | | |
| FR-FILE-02 | Accepted file formats: [list] | Must-have | |
| FR-FILE-03 | Maximum file size: [X MB per file] | Must-have | |

### 7.8 Payment (if applicable)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-PAY-01 | | | |

### 7.9 Tracking & Status

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-TRACK-01 | | | |

### 7.10 Content Management

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-CMS-01 | | | |

### 7.11 Multilingual

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-I18N-01 | Languages at launch: [list] | Must-have | |
| FR-I18N-02 | Languages at v2: [list] | Should-have | |
| FR-I18N-03 | RTL support required: [Yes/No] | | Urdu, Arabic |

---

## 8. NON-FUNCTIONAL REQUIREMENTS

### 8.1 Performance

| Metric | Target | Context |
|--------|--------|---------|
| LCP (Largest Contentful Paint) | < 2.5s | 4G mobile |
| CLS (Cumulative Layout Shift) | < 0.1 | All devices |
| INP (Interaction to Next Paint) | < 200ms | All devices |
| Full page load | < 3s | 4G mobile |
| Time to interactive | < 4s | 4G mobile |

### 8.2 Availability & Scale

| Metric | Target |
|--------|--------|
| Uptime | 99.9% |
| Peak concurrent users | [Number — specify the peak scenario, e.g. "application window opening day"] |
| Load handling | Must sustain [X]× normal traffic without degradation |
| Recovery time objective (RTO) | < [X] hours |

### 8.3 Security

| Requirement | Detail |
|-------------|--------|
| Authentication method | [e.g. Aadhaar OTP / DigiLocker / department SSO / none] |
| Session timeout | [X minutes] with [Y-minute warning before expiry |
| PII handling | [What PII is collected / where stored / retention period] |
| Data in transit | HTTPS / TLS 1.2+ minimum |
| CERT-In compliance | Yes / No |
| No PII in URLs | Required |

### 8.4 Browser & Device Support

| Platform | Browsers | Notes |
|----------|---------|-------|
| Android (Chrome) | Last 2 versions | Primary |
| iOS (Safari) | Last 2 versions | |
| Windows (Chrome, Firefox, Edge) | Last 2 versions | |
| macOS (Safari, Chrome) | Last 2 versions | |
| Samsung Internet | Last 2 versions | Significant Indian market share |

Minimum supported viewport: 320px wide.

### 8.5 Analytics

| Requirement | Detail |
|-------------|--------|
| Analytics platform | [NIC Analytics / approved GoI tool] |
| Key events to track | [List: e.g. "eligibility quiz started", "application submitted", "document upload failed"] |
| Funnels to measure | [List: e.g. "homepage → eligibility → apply → confirm"] |
| Third-party tracking | Requires explicit MeitY approval |

---

## 9. CONTENT REQUIREMENTS

### 9.1 Language Plan

| Locale | Language | Script | Status at launch | Status at v2 | Est. coverage needed |
|--------|----------|--------|-----------------|-------------|---------------------|
| `en` | English | Latin | ✅ Active | ✅ Active | 100% |
| `hi` | Hindi | Devanagari | ✅ Active | ✅ Active | 100% |
| `ta` | Tamil | Tamil | ❌ | ✅ v2 | |
| `bn` | Bengali | Bengali | ❌ | ✅ v2 | |
| `te` | Telugu | Telugu | ❌ | ✅ v2 | |
| `kn` | Kannada | Kannada | ❌ | ✅ v2 | |
| `ml` | Malayalam | Malayalam | ❌ | | |
| `gu` | Gujarati | Gujarati | ❌ | | |
| `mr` | Marathi | Devanagari | ❌ | | |
| `pa` | Punjabi | Gurmukhi | ❌ | | |
| `ur` | Urdu | Nastaliq (RTL) | ❌ | | |

### 9.2 Plain Language Standard

| Field | Value |
|-------|-------|
| Target reading level | [e.g. Class 8 / Grade 6] |
| Terminology rules | [e.g. "avoid acronyms without expansion on first use"] |
| Tone of voice | [e.g. Formal and authoritative / Warm and helpful / Direct and transactional] |

### 9.3 Content Types & Taxonomy

*List every type of content this product will publish. Each type must have an owner and a lifecycle.*

| Content type | Examples | Owner | Update frequency | Expiry rule | Archive rule |
|-------------|---------|-------|-----------------|------------|-------------|
| | | | | | |
| | | | | | |

### 9.4 Mandatory Content

*Content required by law, regulation, or government policy on every page or specific pages.*

| Content | Required on | Authority |
|---------|------------|-----------|
| Copyright notice | Footer — all pages | GoI policy |
| Accessibility statement | Footer / dedicated page | GIGW 3.0 |
| Privacy policy link | Footer — all pages | IT Act |
| RTI information | Footer / dedicated page | RTI Act |
| Last updated date | Footer — all pages | GIGW 3.0 |
| Screen reader access | Header — all pages | GIGW 3.0 |
| [Add product-specific mandatory content] | | |

### 9.5 CMS Requirements

| Requirement | Detail |
|-------------|--------|
| CMS needed | Yes / No |
| Content editable without developer | [List content types] |
| Content scheduling (go-live / expiry dates) | Yes / No |
| Emergency banner capability | Yes / No |
| Multi-author workflow | Yes / No |
| Content approval workflow | Yes / No |

---

## 10. INTEGRATION REQUIREMENTS

### 10.1 Backend Systems

| System | Purpose | Integration type | Auth method | Notes |
|--------|---------|-----------------|------------|-------|
| | | API / SSO / webhook / embed | | |
| | | | | |

### 10.2 Authentication

| Field | Detail |
|-------|--------|
| Method | [Aadhaar OTP / DigiLocker / Department SSO / Mobile OTP / None — public] |
| Required for | [Which pages / actions require login] |
| Guest access | [What can be done without login] |
| Session handling | [See NFR-8.3] |

### 10.3 Payment (if applicable)

| Field | Detail |
|-------|--------|
| Payment gateway | [Provider name] |
| Payment methods | [UPI / Net banking / Card / Challan] |
| Receipt format | [PDF download / email / SMS] |
| Refund flow | [In scope / Out of scope] |

### 10.4 Notifications

| Channel | In scope | Trigger events | Provider |
|---------|---------|---------------|---------|
| Email | | | |
| SMS | | | |
| WhatsApp | | | |
| In-app / browser push | | | |

### 10.5 Document & Data Pre-fill

| Source | Data pre-filled | User action required |
|--------|----------------|---------------------|
| DigiLocker | [e.g. Aadhaar, education certificates] | Grant permission |
| Existing user profile | [e.g. name, DOB, address] | Confirm / edit |
| [Other source] | | |

### 10.6 File Handling

| Field | Detail |
|-------|--------|
| Accepted upload formats | [e.g. PDF, JPG, PNG] |
| Maximum file size | [X MB per file / Y MB total per submission] |
| Virus scanning | Yes / No |
| Storage | [NIC cloud / department server / S3-equivalent] |
| Retention period | [X years post-submission] |

---

## 11. DESIGN & BRAND REQUIREMENTS

> **This section is the primary input to the Figma Make theme extraction.**
> Be as specific as possible. Vague guidance here = wrong design output.

### 11.1 Design System

| Field | Value |
|-------|-------|
| **Design system** | UX4G (ux4g.gov.in) — mandatory for all GoI digital products |
| **UX4G compliance level** | Full compliance required |
| **Component library** | UX4G Figma component library (attached) |

### 11.2 Brand Identity

| Field | Detail |
|-------|--------|
| **Brand name** | |
| **Brand adjectives** | *List exactly 5 adjectives that must be true of every screen. These drive all visual decisions. e.g. "Trustworthy, Approachable, Clear, Indian, Modern"* |
| **Visual tone** | *(Choose one: Formal/institutional / Professional/neutral / Friendly/accessible / Energetic/aspirational)* |
| **Brand rationale** | *One sentence — why these adjectives are right for this audience* |

### 11.3 Colour

| Colour role | Value | Source / justification |
|-------------|-------|----------------------|
| **Primary (main CTA, active states)** | `#[hex]` | [e.g. "Existing brand colour" / "Derived from org logo"] |
| **Secondary (supporting actions, accents)** | `#[hex]` | |
| **Tertiary / accent** | `#[hex]` or "Not applicable" | |
| **Page background** | `#[hex]` or "UX4G default" | |
| **Card surface** | `#[hex]` or "UX4G default" | |
| **Primary text** | `#[hex]` or "UX4G default" | |
| **Link colour** | `#[hex]` or "UX4G default" | |

*If a colour is "UX4G default", the Figma Make prompt will use the UX4G token value.*
*If a hex is provided, it will be used to override the corresponding UX4G semantic token.*

Dark mode: *(Required / Not required / Optional — define if required)*

### 11.4 Typography

| Field | Detail |
|-------|--------|
| **Primary typeface** | [Font name + source. "UX4G default (Noto Sans)" if no preference] |
| **Heading style** | [Weight + tracking. e.g. "Bold, tight tracking" / "UX4G default"] |
| **Body size** | [16px default / 18px if accessibility-first audience] |
| **Regional scripts needed** | [List languages from section 9.1 — fonts will be auto-assigned per UX4G] |

### 11.5 Shape

| Field | Choice | Justification |
|-------|--------|---------------|
| **Corner radius style** | *(Sharp 0–2px / Moderate 4–8px / Soft 12–16px / Pill 999px)* | |
| **Elevation style** | *(Flat — no shadows / Subtle — light shadows / Elevated — card shadows)* | |
| **Border style** | *(Prominent borders / Subtle borders / Borderless)* | |

### 11.6 Iconography

| Field | Choice |
|-------|--------|
| **Icon style** | *(Outline / Filled / Duotone)* |
| **Domain-specific icons needed** | [List any icons not in Lucide React or UX4G icon set] |

### 11.7 Photography & Illustration

| Field | Detail |
|-------|--------|
| **Photography style** | [e.g. "Real personnel, diverse, action-oriented" / "Product UI screenshots" / "None"] |
| **Illustration style** | [e.g. "Flat vector" / "Isometric" / "None"] |
| **Asset source** | [e.g. "Official org media library" / "Stock (approved vendor)" / "AI-generated"] |

### 11.8 Motion & Density

| Field | Choice | Justification |
|-------|--------|---------------|
| **Motion personality** | *(Subtle/functional / Moderate / Expressive)* | |
| **Layout density** | *(Comfortable / Compact)* | |

### 11.9 Existing Reference

*List any existing designs, sites, or products whose visual language should influence (or explicitly NOT influence) this product:*

| Reference | Influence type | What to take / what to avoid |
|-----------|---------------|------------------------------|
| [URL or name] | Positive / Negative | |

---

## 12. ACCESSIBILITY REQUIREMENTS

| ID | Requirement | Standard | Notes |
|----|-------------|----------|-------|
| A-01 | WCAG 2.1 Level AA compliance on all pages | WCAG 2.1 | Non-negotiable |
| A-02 | All images have meaningful alt text | WCAG 1.1.1 | |
| A-03 | No auto-playing or auto-scrolling content without pause control | WCAG 2.2.2 | Tickers, carousels |
| A-04 | Text contrast ≥ 4.5:1 normal, 3:1 large | WCAG 1.4.3 | Both light and dark mode |
| A-05 | All interactive elements keyboard navigable with visible focus | WCAG 2.4.7 | |
| A-06 | All form fields have associated visible labels | WCAG 1.3.1 | |
| A-07 | Error messages describe the fix, not just the error | WCAG 3.3.1 | |
| A-08 | Skip to main content link functional | WCAG 2.4.1 | |
| A-09 | Touch targets ≥ 44×44px | WCAG 2.5.5 | Mobile |
| A-10 | No information conveyed by colour alone | WCAG 1.4.1 | |
| A-11 | Session timeout warns user before expiry with extension option | WCAG 2.2.1 | |
| A-12 | PDFs linked from the site must be tagged accessible | WCAG 1.3.1 | |
| A-13 | Site tested with NVDA+Chrome and VoiceOver+Safari | Manual test | Before launch |
| [Add product-specific requirements] | | | |

---

## 13. CONSTRAINTS

### 13.1 Design Constraints

*Things the design cannot change regardless of UX best practice.*

| Constraint | Detail | Source |
|------------|--------|--------|
| | | |

### 13.2 Technical Constraints

| Constraint | Detail |
|------------|--------|
| Hosting | [NIC / specific infrastructure] |
| Framework | [If mandated] |
| External CDN | [Allowed / Not allowed] |
| Cookies | [Consent requirements] |
| Open-source policy | [GoI procurement / licensing rules] |

### 13.3 Timeline Constraints

| Constraint | Detail |
|------------|--------|
| Hard launch date | [Date — and what drives it: event / policy / fiscal year] |
| Phased rollout | [Yes/No — if yes, describe phases] |
| Application windows that cannot be disrupted | [Specific dates / periods when no downtime is permitted] |

### 13.4 Content Constraints

| Constraint | Detail |
|------------|--------|
| Pre-existing content that cannot be rewritten | [List] |
| Legal copy that is locked | [List] |
| Photography not available | [What cannot be sourced] |

---

## 14. RISKS

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|----|------|-----------|--------|------------|-------|
| R-01 | | High/Med/Low | High/Med/Low | | |
| R-02 | | | | | |

---

## 15. OPEN QUESTIONS

*Every unresolved decision that affects design goes here.
Do not start design until P1 questions are answered.*

| ID | Question | Impact on design | Priority | Owner | Due date | Resolution |
|----|----------|-----------------|----------|-------|----------|------------|
| Q-01 | | | P1 | | | |
| Q-02 | | | P2 | | | |

---

## 16. TIMELINE & MILESTONES

| Phase | Duration | Key deliverables | Dependencies |
|-------|----------|-----------------|-------------|
| 0 — Discovery | | | |
| 1 — Strategy & IA | | | |
| 2 — Design | | | |
| 3 — Usability testing | | | |
| 4 — Development | | | |
| 5 — QA & accessibility audit | | | |
| 6 — Content migration | | | |
| 7 — Soft launch | | | |
| 8 — Full launch | | | |

---

## 17. APPENDIX

### 17.1 Glossary

*Define every domain-specific or technical term used in this BRD.
The design team may not know what "SSR", "Agniveer", "challan", or "GRN" means.*

| Term | Definition |
|------|-----------|
| | |

### 17.2 Current State Audit (if revamp)

*For each page or section being replaced:*

| Page / section | Current URL | Issue | Recommended change |
|----------------|-------------|-------|-------------------|
| | | | |

### 17.3 Related Documents

| Document | Location | Relevance |
|---------|----------|----------|
| UX4G Design System | ux4g.gov.in | Design system reference |
| GIGW 3.0 Guidelines | | Compliance |
| [Technical architecture doc] | | |
| [API documentation] | | |
| [Existing analytics report] | | Baseline metrics |

### 17.4 Stakeholder Sign-off

| Stakeholder | Role | Signature | Date |
|-------------|------|-----------|------|
| | Product owner | | |
| | Design lead | | |
| | Technical lead | | |
| | Accessibility reviewer | | |
| | Legal / compliance | | |

---

*End of document.*

*This BRD is a living document. All changes must be version-controlled
in the Document Control table and communicated to the design team.
Changes after design sign-off require a formal change request.*
