# tube-oracle — Project Context

Project-specific rules for working in this repo. Cross-project working style
(token discipline, Beads workflow, command policy, response format) lives in the
global ~/.claude/CLAUDE.md and is NOT repeated here.

## What this is

A RAG-powered Q&A service over the tube-history.app corpus (structured London
Underground station/line/history JSON). It routes questions to different
retrieval machinery depending on type, rather than treating everything as
semantic search. Portfolio project — legibility and correctness over features.

Status: pre-implementation. The toolchain and repo wiring exist; the RAG
service does not yet. Treat the contracts below as the intended design, not as
already-built behaviour.

## The /ask contract (do not change silently)

The service exposes one endpoint:

POST /ask → { question: string }
→ { answer: string, sources: Source[], route: Route, tokensUsed: number }

Route = "semantic" | "structured" | "hybrid"

This shape is the integration contract with the tube-history frontend. Changing
the request/response shape is a breaking change — flag it explicitly, never
alter it as an incidental part of another task.

## Architecture invariants

These are design decisions, not preferences. Do not violate them to make a task
easier; if a task seems to require violating one, stop and raise it.

- **Two stores, two paths.** Free-text fields (history, fun facts) are chunked
  and embedded into a vector store. Structured fields (dates, Grade listing,
  line membership, architect) live as queryable rows. A single sqlite-vec file
  may hold both.
- **Structured questions never use vector similarity.** Counts, filters,
  date/grade/line queries are answered by the LLM emitting a query via
  tool-calling, executed against the structured store. Vector search is wrong
  for these and must not be used as a shortcut.
- **A router classifies first.** Questions are routed semantic / structured /
  hybrid before retrieval. The route taken is returned in the response.
- **Grounded generation only.** Answers are built from retrieved context and
  cite their sources (which station/field each claim came from).
- **Abstain rather than invent.** If retrieval returns nothing relevant, the
  service must decline ("I don't have that"), not fabricate an answer. This is
  a measurable control, not a soft guideline.

## Secrets and boundaries

- **Provider API keys are server-side only.** Never in client code, never sent
  to the browser, never committed. Real values live in `.env` (gitignored);
  `.env.example` documents required keys with no values.
- **The browser never calls this service directly.** tube-history proxies
  browser → tube-oracle via a serverless function, which owns the public
  controls (rate limit, budget cap, shared-secret header, CORS locked to
  origin). Do not add public/CORS-open endpoints to this service or expose it
  to direct browser access.
- **Local-first by default.** Development runs against local models (Ollama,
  local embeddings, local sqlite-vec) and needs no API key. The hosted API is
  for end-stage validation only. Don't introduce a hard dependency on a paid
  provider for the core paths.

## Evals are first-class

The golden eval set (questions tagged with expected route, expected sources,
known answer) is part of the project, not an afterthought. When changing
retrieval, routing, or generation, the eval harness should be re-run — treat a
regression in routing accuracy, retrieval quality, faithfulness, answer
correctness, or abstention as a real failure, not noise.

## Conventions

- TypeScript, ESM (`type: module`, NodeNext) → relative imports carry `.js`.
- Strict TypeScript; typed linting is on. Don't weaken either to pass a check.
- Stores and build output (`*.db`, `dist/`) are generated artifacts — never
  edit or commit them.
