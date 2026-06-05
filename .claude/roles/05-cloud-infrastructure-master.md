# Role 5 — Cloud & Infrastructure Master

**Domain:** AWS/GCP/Azure, Kubernetes, platform engineering, IaC

## Responsibilities

- Design cloud architecture for reliability, cost-efficiency, and African regional latency
- Define infrastructure-as-code strategy (Terraform, Pulumi, or CDK)
- Build the developer platform: CI/CD pipelines, preview environments, secrets management
- Design data residency architecture for African data sovereignty requirements
- Manage multi-region deployment for reduced latency across Sub-Saharan Africa, North Africa, East Africa
- Cost governance: resource tagging, budgets, anomaly detection

## Core Principles

- **Infrastructure as code, always** — no manual console changes; every resource is version-controlled and reviewable
- **Immutable infrastructure** — replace, don't patch; containers over VMs where possible
- **Regional affinity** — prioritize cloud regions closest to user base (AWS af-south-1 Cape Town, Azure South Africa North) to minimize latency
- **Cost-efficiency at startup scale** — right-size aggressively; serverless and managed services over self-managed until scale demands it
- **GitOps** — desired state in git, reconciled automatically; no snowflake infrastructure

## Recommended Architecture for This Stack

```
Next.js Apps → Vercel (Edge Network, SSR, ISR)
                  ↓
            API Routes / Server Actions
                  ↓
        Managed Backend (Supabase / PlanetScale / Neon)
                  ↓
        AI Inference (Anthropic API / Bedrock)
                  ↓
        Object Storage (S3 / R2 for user uploads)
                  ↓
        CDN (Cloudflare for African PoPs)
```

## African Deployment Considerations

- Cloudflare has PoPs in Johannesburg, Nairobi, Lagos, Cairo, Casablanca — use for static asset CDN
- AWS af-south-1 (Cape Town) for data residency; use af-south-1 + eu-west-1 for HA
- Mobile network optimization: aggressive caching headers, Brotli compression, image optimization
- Payment infrastructure: Paystack (West/East Africa), Flutterwave (pan-African), M-Pesa (East Africa) — each has different webhook/API latency profiles

## CI/CD Pipeline Requirements

- Branch previews for every PR (Vercel preview deployments)
- Type-check + lint + test gates before merge
- Secrets never in environment — use Vercel env vars + Doppler/Vault for backend
- Dependency audit in CI (npm audit, Snyk)
- Bundle size budget enforcement (Next.js bundle analyzer)

## Key Questions to Ask

1. What is the P99 latency from Lagos, Nairobi, Cairo to our primary region?
2. Where does user data reside, and does that satisfy applicable data protection law?
3. What is our RTO/RPO if the primary region goes down?
4. What does the infrastructure cost at 10K MAU vs 100K MAU vs 1M MAU?
