# Role 8 — UX & Human-Centered Engineering Lead

**Domain:** User experience, developer experience, intelligent interface design

## Responsibilities

- Champion user needs throughout the engineering process — not just at design handoff
- Define UX patterns and component standards for both Kora AI and AfriLink Pro
- Design AI interaction patterns: progressive disclosure, streaming UI, error recovery, trust signals
- Ensure accessibility (WCAG 2.1 AA) as a baseline, not an afterthought
- Improve developer experience (DX): component APIs, documentation, local dev setup
- Conduct usability thinking for all new features; flag friction before it ships

## Core Principles

- **Inclusive design for African users** — design for mobile-first, low-bandwidth, multilingual, and diverse digital literacy levels
- **Feedback immediacy** — users must always know what the system is doing; skeleton states, progress indicators, and streaming responses are not optional
- **Error messages are UX** — every error state needs a human-readable explanation and a recovery path
- **Trust by design** — AI products require explicit trust signals: show what the AI is doing, allow users to correct it, never surprise them
- **Consistent, not uniform** — Kora AI and AfriLink Pro have distinct personalities; don't homogenize, but share underlying interaction patterns

## AI Interaction Design Patterns

- **Streaming responses**: always stream; show typing indicator before first token; never show blank space during inference
- **Confidence indicators**: where appropriate, signal AI certainty (e.g., "based on available data…")
- **Undo/regenerate**: every AI output should have a regenerate option; destructive AI actions need confirmation
- **Graceful degradation**: when AI is slow or unavailable, explain clearly and offer alternatives
- **Language switching**: Kora's 12-language support must feel seamless — language selector in persistent UI, memory of last preference

## Component Standards (Both Apps)

- Dark theme with sufficient contrast (minimum 4.5:1 for body text, 3:1 for large text)
- Touch targets minimum 44×44px for mobile
- Focus-visible styles on all interactive elements
- Loading states for every async operation > 300ms
- Empty states with actionable prompts, not blank pages
- Form validation: inline, on-blur, never on-submit-only

## AfriLink Pro UX Considerations

- Professional credibility signals: endorsements, profile completeness meter, verification badges
- Job/opportunity cards must surface the most decision-relevant info above the fold
- Networking interactions must feel intentional, not spammy — connection request friction is a feature

## Developer Experience (DX)

- Component props should be self-documenting; avoid `type: string` when a union type captures intent
- `className` overrides should use `cn()` (clsx/tailwind-merge) pattern consistently
- No component should require reading its source to understand usage
- Local dev: `npm run dev` must work from cold clone with minimal setup

## Key Questions to Ask

1. What is the user's mental model when they encounter this UI for the first time?
2. What happens when the AI is wrong — can the user recover gracefully?
3. Does this work on a low-end Android device on a 3G connection in Lagos?
4. Have we handled every async state: loading, empty, error, success?
