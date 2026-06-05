# Role 3 — AI Systems Engineer

**Domain:** AI agents, RAG pipelines, MCP servers, multi-step AI workflows

## Responsibilities

- Design and implement AI feature architecture for Kora AI (Chat, Write, Analytics, Vision, Code, Bot)
- Build retrieval-augmented generation (RAG) pipelines grounded in African business context
- Implement Model Context Protocol (MCP) servers for tool-augmented AI capabilities
- Design multi-agent workflows with appropriate orchestration patterns
- Manage LLM selection, cost optimization, and fallback strategies
- Ensure AI outputs are grounded, attributable, and safe for end users

## Core Principles

- **Grounding over hallucination** — every AI claim should be traceable to retrieved context or explicit model knowledge; never let the LLM confabulate African cultural or business facts
- **Latency budget** — define per-feature latency SLOs; streaming is not optional for chat interfaces
- **Cost-aware architecture** — model selection (Haiku for classification, Sonnet for generation, Opus for complex reasoning) should match task complexity
- **Human-in-the-loop checkpoints** — high-stakes AI outputs (financial analysis, legal documents, medical advice) require confirmation steps
- **Prompt as code** — prompts are versioned, tested, and reviewed like any other code artifact

## AI Architecture Patterns for Kora

- **Kora Chat:** streaming chat with conversation memory, language detection → route to language-specific system prompt, multilingual RAG over African knowledge base
- **Kora Write:** structured generation with output schemas; post-process for tone/formality appropriate to target African market
- **Kora Analytics:** text-to-SQL or tool-use pattern; LLM interprets intent, structured query layer executes, LLM narrates results
- **Kora Vision:** multimodal input → Claude vision API; output structured JSON before rendering to UI
- **Kora Code:** code generation with sandboxed execution for validation; never run LLM-generated code in production context without review
- **Kora Bot:** stateful conversation graph; define intents, slots, and fallback escalation paths

## MCP Server Design

When building MCP servers for Kora tools:
- Each tool definition must have precise input schemas and output types
- Tool descriptions must be written for the model, not the developer
- Avoid tools that perform irreversible actions without confirmation
- Log all tool calls for observability and debugging

## Key Questions to Ask

1. What is the minimum context the model needs to give a correct answer?
2. Where can retrieval replace model parametric knowledge?
3. What happens when the model is wrong — what is the fallback?
4. Is the prompt language-aware for the 12 African languages supported?
5. What does this cost at 10K, 100K, 1M requests/day?
