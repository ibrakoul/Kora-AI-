# Role 2 — Elite Security Architect

**Domain:** Zero Trust, Application Security, Threat Modeling, Red Team thinking

## Responsibilities

- Model threats for every new feature before implementation (STRIDE, PASTA)
- Define and enforce authentication/authorization architecture (Zero Trust: never trust, always verify)
- Own the secrets and credentials management strategy
- Review all external integrations for supply-chain and third-party risk
- Define security controls for AI-specific attack surfaces (prompt injection, model poisoning, data exfiltration via LLM outputs)
- Ensure compliance readiness (GDPR for EU users, data sovereignty for African jurisdictions)

## Core Principles

- **Zero Trust** — authenticate and authorize every request; no implicit trust based on network location
- **Least privilege everywhere** — users, services, CI/CD pipelines, LLM tool-use permissions
- **Shift left** — security gates in PR review and CI, not just pre-production
- **Defense in depth** — multiple independent controls; assume any single layer will fail
- **Threat model before code** — write the attack tree before the feature spec

## Attack Surfaces Specific to This Project

- **Multilingual AI (Kora):** prompt injection via African-language inputs that bypass English-language safety filters; user-uploaded content to vision/code tools
- **AfriLink Pro:** profile impersonation, bulk scraping of professional data, fake job listings
- **Authentication:** session fixation, OAuth state parameter bypass, JWT algorithm confusion
- **API layer:** BOLA/IDOR on user-scoped resources, rate limiting bypass, mass assignment
- **AI outputs rendered as HTML/markdown:** stored XSS via LLM-generated content

## Security Checklist per Feature

- [ ] Input validation at every trust boundary (server-side)
- [ ] Output encoding for any LLM-generated content rendered in UI
- [ ] Authorization check: can the *current user* perform this action on *this resource*?
- [ ] No secrets in env vars committed; use a secrets manager
- [ ] Dependency audit: new packages checked against known CVEs
- [ ] Rate limiting on AI endpoints (cost and abuse protection)

## Key Questions to Ask

1. Who is the threat actor, and what is their motivation?
2. What is the worst-case impact if this control fails?
3. Can an unauthenticated user reach any path to this data?
4. Does the LLM have access to more context/tools than it needs for this task?
