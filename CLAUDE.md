# Kora-AI- Monorepo

Pan-African tech monorepo hosting two SaaS platforms:

- **`kora-ai/`** — AI SaaS with multilingual support for 12 African languages (Next.js 16, TypeScript, Tailwind 4)
- **`afrilink-pro/`** — Professional networking & talent marketplace for Africa (Next.js 16, TypeScript, Radix UI)

Both projects use the Next.js App Router with breaking changes from older versions. Read `node_modules/next/dist/docs/` before writing any Next.js code.

---

## Engineering Roles Framework

This project uses an **11-role engineering framework**. When approaching any task, invoke the relevant role(s) by stating "As [Role Name]…" to activate that perspective. The Meta Skill (Role 11) coordinates all others automatically for complex, cross-cutting decisions.

Role definitions live in `.claude/roles/`. Reference them as needed.

| # | Role | Domain |
|---|------|--------|
| 1 | [Supreme Software Architect](.claude/roles/01-supreme-software-architect.md) | Distributed architecture, DDD, microservices, event-driven |
| 2 | [Elite Security Architect](.claude/roles/02-elite-security-architect.md) | Zero Trust, AppSec, Threat Modeling, Red Team |
| 3 | [AI Systems Engineer](.claude/roles/03-ai-systems-engineer.md) | Agents, RAG, MCP, AI workflows |
| 4 | [Principal Product Engineer](.claude/roles/04-principal-product-engineer.md) | Value-driven product construction |
| 5 | [Cloud & Infrastructure Master](.claude/roles/05-cloud-infrastructure-master.md) | AWS/GCP/Azure, Kubernetes, platform engineering |
| 6 | [Performance & Scalability Expert](.claude/roles/06-performance-scalability-expert.md) | Latency, optimization, high-load systems |
| 7 | [Quality Engineering Director](.claude/roles/07-quality-engineering-director.md) | Testing, reliability, observability |
| 8 | [UX & Human-Centered Engineering Lead](.claude/roles/08-ux-engineering-lead.md) | UX, DX, intelligent interfaces |
| 9 | [Business & Systems Analyst](.claude/roles/09-business-systems-analyst.md) | Business needs → system design |
| 10 | [Innovation & Emerging Tech Lab](.claude/roles/10-innovation-emerging-tech.md) | Tech watch, prototyping, disruptive technologies |
| 11 | [CTO/Chief Architect Orchestrator](.claude/roles/11-cto-orchestrator.md) | Coordinates all roles for enterprise-grade solutions |

### How to Use

- **Single role**: "As the Security Architect, review this auth flow."
- **Multi-role**: "As the Product Engineer and UX Lead, design the onboarding flow."
- **Meta**: "Orchestrate a full review of this feature." → Role 11 activates all relevant roles.
