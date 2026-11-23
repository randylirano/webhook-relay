# CLAUDE.md

Read docs/SPEC.md fully before writing code. The acceptance criteria in it are the definition of done. Run `bun run verify` after every task and never mark a task complete with it failing. Do not substitute an ORM, change the schema, or weaken a test's parameters without asking.

`docs/` is gitignored (local planning docs). If `docs/SPEC.md` is missing, the source is `../project_notes/webhook-relay-spec.md`.

## Repo conventions

- **Package manager: bun** (not pnpm, despite the spec), matching ledger-api. Runtime: Node 24 LTS (`nvm use`). Scripts run under Node via `bun run <script>`.
- TypeScript is pinned to `~6.0`: TS 7 is not yet supported by ts-jest / typescript-eslint.
- `bun run verify` = lint (eslint + `tsc --noEmit`) + `test` + `test:race`. Docker must be running: tests use Testcontainers (`postgres:17-alpine`), one container per Jest run, started in `test/helpers/global-setup.ts`, which also applies migrations.
- Local Postgres from `docker compose` listens on host port **5433** (ledger-api uses 5432).
- `process.env` is read only in `src/config/env.ts` (Zod). Add new vars there and to `.env.example`.
- DB access: inject the pool with `@InjectPool()` from `src/db/pool.ts`; hand-written SQL in `<feature>.repository.ts`; transactions via `withTransaction(pool, fn)` from `src/db/tx.ts`.
- node-postgres returns `bigint` columns as strings: convert at the repository edge.
- Errors: throw `ProblemError(code, status)` from `src/common/problem.ts`; tests assert `code`, never messages. Validate request bodies with `ZodPipe`.
- Migrations: SQL files in `src/migrations`, created with `bun run migrate:create <name>`.
- Integration tests boot the real app with `createTestApp()` from `test/helpers/app.ts`.
