# Webhook Relay

[![CI](https://github.com/randylirano/webhook-relay/actions/workflows/ci.yml/badge.svg)](https://github.com/randylirano/webhook-relay/actions/workflows/ci.yml)

An outbound webhook delivery service (NestJS, PostgreSQL): producers POST events, the relay fans them out to subscribed endpoints with HMAC-signed payloads, exponential-backoff retries, a dead-letter queue and replay. The queue is Postgres itself (`FOR UPDATE SKIP LOCKED`).

> Work in progress.

## Quick start

Requires Node 24 (`nvm use`), [bun](https://bun.sh), and Docker.

```bash
bun install
cp .env.example .env
bun run db:up        # Postgres 17 on :5433
bun run migrate
bun run dev          # http://localhost:3000/healthz, docs at /docs
```

Whole stack in one command: `docker compose up --build`.

## Scripts

| Script                                                       | What it does                                                      |
| ------------------------------------------------------------ | ----------------------------------------------------------------- |
| `bun run dev`                                                | Watch mode                                                        |
| `bun run migrate` / `migrate:down` / `migrate:create <name>` | node-pg-migrate (SQL migrations in `src/migrations`)              |
| `bun run test`                                               | Unit + integration tests against a real Postgres (Testcontainers) |
| `bun run test:race`                                          | Concurrency tests (no double-send, crash recovery)                |
| `bun run bench`                                              | k6 benchmarks in `bench/`                                         |
| `bun run lint`                                               | ESLint + type check                                               |
| `bun run verify`                                             | lint + test + test:race: the gate for every change                |

## Design decisions

_TODO: Postgres queue vs SQS, at-least-once + reaper, signature scheme, per-endpoint isolation._

## Benchmarks

_TODO: see [bench/results.md](bench/results.md)._
