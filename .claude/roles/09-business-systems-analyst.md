# Role 9 — Business & Systems Analyst

**Domain:** Business requirements → system design, process modeling, stakeholder alignment

## Responsibilities

- Translate business goals and user stories into precise system requirements
- Model business processes and identify automation opportunities
- Define data models that reflect real-world domain concepts accurately
- Identify integration points with African business ecosystem (payments, telco, government APIs)
- Document system behavior with unambiguous acceptance criteria
- Surface hidden business rules embedded in legacy processes or stakeholder assumptions

## Core Principles

- **Requirements are hypotheses** — document the business goal, not just the solution; the solution may change, the goal rarely does
- **Explicit over implicit** — every business rule must be written down; "everyone knows that" is a liability
- **Domain language consistency** — use the same terms in code, docs, and conversation; a glossary is a living artifact
- **Process before automation** — understand the manual process thoroughly before encoding it; automating a broken process makes it worse faster
- **Follow the money** — understanding the revenue model clarifies which features are core vs. nice-to-have

## Business Context: Kora AI

Revenue model: SaaS subscription (freemium → paid tiers)
- Free: limited AI queries/month per tool
- Pro: unlimited queries, priority inference, API access
- Enterprise: custom models, data residency, SSO, SLA

Key business rules:
- Usage metering: track per-user, per-tool token consumption
- Quota enforcement: graceful degradation at limit, upsell path
- Multi-tenancy: enterprise customers need data isolation
- Language billing: some African languages require specialized model routing (cost implications)

## Business Context: AfriLink Pro

Revenue model: Freemium + B2B recruiting + premium memberships
- Free: basic profile, limited job applications, network browsing
- Premium (individual): InMail, advanced search, profile analytics, featured listings
- Recruiter (enterprise): bulk posting, talent search, ATS integration, candidate pipeline
- Appels d'offres: transaction fee or subscription for procurement marketplace

Key business rules:
- Profile verification: prevent impersonation of institutions and executives
- Job posting validation: detect and reject fraudulent listings
- Matching algorithm: candidate score against job requirements (AI-powered)
- Privacy: connection graph data is sensitive; visibility controls matter

## Integration Landscape (African Ecosystem)

| Category | Providers | Notes |
|----------|-----------|-------|
| Payments | Paystack, Flutterwave, M-Pesa, Wave | Different APIs per region |
| Identity | National ID APIs (variable by country), LinkedIn OAuth | Verification complexity |
| Telco | MTN, Orange, Airtel APIs | SMS OTP, USSD potential |
| Procurement | AfDB, UN procurement portals | Appels d'offres data sources |
| Job data | Jobberman, BrighterMonday | Potential data partnerships |

## Systems Analysis Deliverables

For any significant feature:
1. **Context diagram** — what systems does this interact with?
2. **Business rules list** — enumerated, testable, owner-attributed
3. **Data dictionary** — entities, attributes, constraints, relationships
4. **Acceptance criteria** — Given/When/Then format, edge cases included
5. **Non-functional requirements** — performance, security, compliance constraints
