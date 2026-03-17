# Copilot Instructions — motor-liquidez

## Big picture (ecosystem)

- This repo is a 4‑service NestJS ecosystem with shared MySQL/Redis and BullMQ queues. Overview and flow diagrams live in [docs/README.md](docs/README.md) and per‑project overviews in [docs/projects/](docs/projects/).
- Execution flow: le-manager configures master data → liquidity-engine orchestrates quotes and publishes jobs → le-jobs executes provider locks → le-crons batches/monitors wires. See [docs/projects/le-manager/OVERVIEW.md](docs/projects/le-manager/OVERVIEW.md), [docs/projects/liquidity-engine/OVERVIEW.md](docs/projects/liquidity-engine/OVERVIEW.md), [docs/projects/le-jobs/OVERVIEW.md](docs/projects/le-jobs/OVERVIEW.md), [docs/projects/le-crons/OVERVIEW.md](docs/projects/le-crons/OVERVIEW.md).

## Service boundaries & data flow

- Shared state is in MySQL tables like `purchase__order`, `purchase__order_leg`, `purchase__reserved_quote` and catalog/provider tables (see [docs/README.md](docs/README.md)).
- Redis/BullMQ queues are the integration point between services. Common queues: `lock-order`, `EBURY_LOCK_QUEUE`, `STILLMAN_LOCK_QUEUE`, `batch-processing`, `ebury-quotation-polling` (see [docs/projects/liquidity-engine/OVERVIEW.md](docs/projects/liquidity-engine/OVERVIEW.md) and [docs/projects/le-jobs/OVERVIEW.md](docs/projects/le-jobs/OVERVIEW.md)).
- Status lifecycle is critical: `purchase__order_leg` moves PENDING → PROCESSING → RESERVED → DONE or FAILED (details in [docs/projects/le-jobs/OVERVIEW.md](docs/projects/le-jobs/OVERVIEW.md)).

## Project‑specific conventions

- le-jobs has **no HTTP server**; it is pure BullMQ workers. Don’t add controllers there (see [azify-le-jobs/README.md](azify-le-jobs/README.md)).
- le-crons enforces “observability first” logging fields for every cron execution (see [azify-le-crons/README.md](azify-le-crons/README.md)).
- le-manager uses `x-auth` HMAC header; time window and nonce rules are strict (see [azify-le-manager/README.md](azify-le-manager/README.md)).
- liquidity-engine follows Clean Architecture and keeps core quote logic in `src/quotes/` (see [azify-liquidity-engine/README.md](azify-liquidity-engine/README.md)).

## Dev workflows (local)

- One‑time setup is documented in [docs/desenvolvimento/SETUP.md](docs/desenvolvimento/SETUP.md) including Docker MySQL/Redis and Prisma migrations.
- Run services individually with their package scripts (see each project’s README). Typical dev commands:
  - liquidity-engine: `pnpm dev`, `pnpm db:migrate`, `pnpm db:seed`
  - le-manager: `pnpm start:dev` and `pnpm xauth:dev` to generate dev keys
  - le-jobs: `pnpm start:dev` (workers only)
  - le-crons: `pnpm start:dev`

## Integration points to watch

- Provider integrations (Ebury, Stillman, Topazio) span engine, jobs, and crons; consult [docs/integracoes/](docs/integracoes/) before changing payloads or credentials.
- PM2 is the production process manager across services; configs are in each project’s ecosystem file (see [azify-le-jobs/README.md](azify-le-jobs/README.md) and [azify-le-crons/README.md](azify-le-crons/README.md)).

## Where to look first

- End‑to‑end flows: [docs/flows/](docs/flows/)
- Core quote orchestration: [azify-liquidity-engine/docs/src/quotes/README.md](azify-liquidity-engine/docs/src/quotes/README.md)
- Job/worker design & idempotency: [docs/projects/le-jobs/OVERVIEW.md](docs/projects/le-jobs/OVERVIEW.md)
