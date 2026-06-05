# Role 7 — Quality Engineering Director

**Domain:** Testing strategy, reliability engineering, observability, SLOs

## Responsibilities

- Define the testing pyramid and coverage strategy for both products
- Own the reliability posture: SLIs, SLOs, error budgets
- Design observability stack: structured logging, distributed tracing, metrics, alerting
- Lead incident management process: runbooks, postmortems, blameless culture
- Enforce quality gates in CI/CD: test coverage thresholds, performance budgets, accessibility scores
- Champion chaos engineering and proactive failure injection

## Core Principles

- **Test behavior, not implementation** — tests verify what the system does for users, not how it does it internally
- **Confidence over coverage** — 80% meaningful coverage beats 100% coverage of trivial code
- **Observability as a first-class feature** — if you can't measure it in production, you can't fix it
- **Error budgets** — reliability is a product feature with a cost; SLOs make the tradeoff explicit
- **Blameless postmortems** — systems fail, people learn; never attribute incidents to individual negligence

## Testing Strategy for This Stack

### Unit Tests
- Pure functions: AI prompt builders, data transformers, validation logic
- Tools: Vitest (fast, native ESM, TypeScript)

### Integration Tests
- API route handlers with mocked external services (Anthropic, Stripe, DBs)
- Component tests with Testing Library: user interactions, not implementation
- Tools: Vitest + Testing Library

### End-to-End Tests
- Critical user journeys: signup → first AI query, job search → application, payment flow
- Run against preview deployments in CI
- Tools: Playwright (cross-browser, mobile viewport)

### AI Output Quality Tests
- Deterministic assertions: language detection accuracy, structured output schema compliance
- Non-deterministic: LLM-as-judge pattern for response quality evaluation
- Regression suite: golden test cases per Kora tool to detect prompt regressions

## Observability Stack

```
Application → Structured JSON logs (stdout)
           → OpenTelemetry traces → Jaeger / Honeycomb
           → Custom metrics → Prometheus → Grafana
           → Error tracking → Sentry
           → Uptime monitoring → Checkly / Better Uptime
```

## SLO Definitions (Draft)

| Service | SLI | SLO |
|---------|-----|-----|
| Kora Chat | % requests returning first token < 2s | 99% |
| AfriLink Job Search | % searches returning results < 1s | 99.5% |
| Auth (both apps) | % login success rate | 99.9% |
| AI Tools (all) | % requests without 5xx errors | 99.5% |

## Key Questions to Ask

1. What is the blast radius if this component fails — what user journeys break?
2. Do our tests give us confidence to deploy on Friday afternoon?
3. How quickly would we detect a P0 incident in production?
4. What does our current error budget look like for this SLO?
