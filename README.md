# tube-oracle

A question-answering service over the [tube-history.app](https://tube-history.app)
corpus of London Underground station and line history — built to route different
kinds of questions to different retrieval methods, rather than treating every
question the same way.

> **Status: early development.** The corpus ingestion and validation layer is in
> place — the structured corpus loads and validates into typed in-memory
> structures. The retrieval service (router, stores, generation) is still being
> built. Sections below grow with the project.

## Why this exists

The corpus isn't uniform. Some of it is free-text prose — station histories, fun
facts — best answered by semantic similarity. Some of it is structured — opening
dates, zones, Grade listings, line membership, architects — where similarity
search is the wrong tool and a precise query is right.

tube-oracle routes each question to the machinery that fits it, rather than
forcing everything through one retrieval path. And when nothing relevant is
found, it declines rather than inventing an answer.

## The /ask contract

One endpoint:

```
POST /ask  { question: string }
        →  { answer: string, sources: Source[], route: Route, tokensUsed: number }

Route = "semantic" | "structured" | "hybrid"
```

`route` reports which retrieval path answered the question; `sources` ground
every answer in the station and field each claim came from.

## Architecture

_Intended design — the targets the build is working toward:_

- **A router classifies first** — semantic / structured / hybrid — before any
  retrieval runs.
- **Two stores, two paths.** Free-text fields are chunked and embedded into a
  vector store; structured fields (dates, grades, line membership) live as
  queryable rows. Structured questions are answered by a precise query, never by
  vector similarity.
- **Grounded generation only**, with sources cited — and the service **abstains**
  when retrieval finds nothing relevant.

_Built so far — corpus ingestion:_

- `src/corpus/` reads the corpus and validates it into typed in-memory
  structures:
  - `types.ts` — the domain types (`Station`, `Line`, details, …)
  - `validate.ts` — hand-rolled validation doors (`unknown → typed`, throwing on
    malformed data), layered as file doors → record doors → primitives
  - `io.ts` — reading corpus files off disk
  - `load.ts` — `loadCorpus`, composing the above and reporting entity counts
- `src/ask.ts` holds the /ask contract; `src/index.ts` is the entry point.

## Evaluation

_Coming with the eval harness — how answer quality (routing, retrieval,
faithfulness, abstention) is measured rather than assumed._

## Running locally

```
npm install
npm run dev      # loads and validates the corpus, logging entity counts
```

Designed to run locally with no API key during development; hosted model
providers are reserved for end-stage validation.

## Stack

- **TypeScript** (ESM, strict; typed linting)
- Further dependencies added as the retrieval service is built.
