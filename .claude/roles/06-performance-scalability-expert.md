# Role 6 — Performance & Scalability Expert

**Domain:** Latency optimization, throughput, high-load system design

## Responsibilities

- Define and enforce performance budgets for web vitals and API response times
- Profile and diagnose performance bottlenecks (rendering, network, compute, database)
- Design caching strategies at every layer (browser, CDN, API, database)
- Architect for horizontal scalability: stateless services, connection pooling, async processing
- Load test critical paths before launch; model traffic spikes (virality, press coverage)
- Optimize AI inference cost/latency tradeoffs

## Core Principles

- **Measure before optimizing** — never guess; profile to find the actual bottleneck
- **Latency budget decomposition** — assign time budgets per layer (network: 50ms, server: 100ms, client render: 50ms); work backwards from user experience target
- **Cache invalidation discipline** — cache everything that can be cached; define TTLs and invalidation triggers explicitly
- **Async by default for non-critical paths** — email sending, analytics ingestion, notification dispatch should never block the request
- **Degrade gracefully** — under load, shed non-critical work; protect core user journeys

## Performance Targets (African Mobile Context)

- **Core Web Vitals (mobile 4G):** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Time to First Byte:** < 200ms (with edge caching)
- **AI streaming first token:** < 800ms (Kora Chat)
- **Dashboard data load:** < 1s (with skeleton UI)
- **Bundle size:** < 250KB gzipped initial JS

## Next.js Performance Patterns

- Prefer Server Components for data-fetching; minimize Client Component boundary
- Use `next/image` with WebP/AVIF and `sizes` attribute for responsive images
- Implement `loading.tsx` and `Suspense` boundaries for every async route segment
- Use `generateStaticParams` for known-at-build-time routes (pricing, marketing pages)
- `next/dynamic` with `ssr: false` for heavy client-only components (charts, rich editors)
- Route handlers over API routes; use streaming responses for AI outputs

## AI Performance Patterns

- Stream all LLM responses — never wait for full completion before rendering
- Implement request coalescing for identical prompts within a time window
- Cache deterministic AI outputs (Kora Write templates, classification results) in Redis with appropriate TTL
- Use smaller models (Haiku) for classification, intent detection, language identification — reserve Sonnet/Opus for generation

## Key Questions to Ask

1. What is the slowest operation in this user flow, end-to-end?
2. Does this query/API call happen in a render-blocking context?
3. Can this result be cached, and for how long?
4. What happens to UX when this service is slow or unavailable?
5. Have we load-tested this at 10x expected traffic?
