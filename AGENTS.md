# AGENTS.md — Agent instructions for this repository

This file routes any coding agent (Claude Code, Codex, Cursor, …) working on this
repository. Read it fully before writing code. The detailed guides live in
`agents/guides/` and are **mandatory reading per task type** (see ROUTING).

## What this repository is

A full-stack lys boilerplate: `api/` (GraphQL API on the lys framework), `worker/`
(Celery), `front/` (React + Relay on lys-front), `compose.yaml` (all-Docker local
stack with hot reload). Everything runs with `docker compose up -d` after copying
the `.env.example` files.

## Hard rules (always apply)

- **R1 — Language.** All code, comments, documentation and commit messages in
  English.
- **R2 — Style.** Python: PEP 8, max 120 chars, 4 spaces, double quotes, type
  hints. TypeScript/React: match the existing files (4 spaces, double quotes).
- **R3 — Never commit or push without an explicit user instruction.** Implementing
  is not committing.
- **R4 — No secrets.** Never commit `.env` files or any credential. Values that
  vary per environment go through `.env` / settings.
- **R5 — Production-ready only.** No shortcuts, no "good enough for now".
- **R6 — Never bypass the framework.** No direct imports of lys entities/services
  (see `agents/guides/back/rules.md`), no GraphQL in front elements, respect the
  layering (see `agents/guides/front/architecture.md`).
- **R7 — Verify your work.** After any change, run the self-check checklist in
  `agents/guides/verification.md` and report the results honestly (failures
  included).
- **R8 — Match the surroundings.** Before writing a new component/module, read a
  sibling of the same type and mirror its structure, naming and idioms. The
  reference implementations pointed to by the guides compile and pass tests —
  imitate them.

## ROUTING — read the guide before the task

| Task | Mandatory guide(s) |
|------|--------------------|
| Any front component (element / feature / restrictedFeature / page) | `agents/guides/front/architecture.md` + the guide for that layer |
| Anything opening in a panel/drawer, or a component living in one | `agents/guides/front/dialog.md` |
| Page layout / tabs bar / new page template | `agents/guides/front/page-template.md` |
| Provider stack, menus, tabs configs, client selector | `agents/guides/front/app-shell.md` |
| Translations (front) | `agents/guides/front/translations.md` |
| Styling, colors, spacing | `agents/guides/front/style.md` |
| Tests or stories | `agents/guides/front/testing.md` |
| New back app or module | `agents/guides/back/app-creation.md` + `agents/guides/back/architecture.md` |
| Entity / service | `agents/guides/back/entity.md` / `agents/guides/back/service.md` |
| GraphQL (node, query, mutation) | `agents/guides/back/node.md` + `agents/guides/back/webservice.md` |
| Seed data / reference data | `agents/guides/back/fixtures.md` |
| Email or notification (incl. creating a new notification type) | `agents/guides/back/emails-events.md` |
| Background task / scheduled job | `agents/guides/back/tasks.md` |
| Real-time signal (SSE) | `agents/guides/back/signals.md` |
| Permission / access level / tenant filtering | `agents/guides/back/permissions.md` |
| Chatbot prompt / AI tool on a webservice | `agents/guides/back/ai.md` |
| Database schema change | `agents/guides/back/migrations.md` |
| Any back change | `agents/guides/back/rules.md` (allowed / forbidden) |
| Before reporting done | `agents/guides/verification.md` |

## Where things live

```
api/                        GraphQL API (lys apps, settings, migrations)
worker/                     Celery worker (lys tasks)
front/
  src/components/
    elements/               Layer 1 — pure UI (no GraphQL, no permissions)
    features/               Layer 2 — business logic, no direct permissions
    restrictedFeatures/     Layer 3 — permissions + GraphQL (Relay)
    pages/                  Route definitions (config.ts + component)
    appTemplates/           Provider stack + routing shell
  src/styles/               Design tokens → CSS variables → Bootstrap overrides
agents/guides/              The guides this file routes to
bin/                        Utility scripts (schema export, …)
```

## Daily commands (all-Docker workflow)

```bash
docker compose up -d                                  # start everything (hot reload)
docker compose logs -f api                            # follow logs
docker compose restart api worker                     # after editing a .env
docker compose exec api python main.py makemigrations -m "…"   # after entity changes
./bin/generate-schema.sh                              # schema + Relay types after webservice changes
```

Host-side front checks (tests, typecheck, storybook): `cd front && npm run test / npx tsc --noEmit / npm run build`.
