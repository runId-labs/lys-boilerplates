# AGENTS.md — Agent instructions for this repository

This file routes any coding agent (Claude Code, Codex, Cursor, …) working on
this repository. Read it fully before writing code. The detailed guides are
**mandatory reading per task type** (see ROUTING).

## What this repository is

A full-stack lys boilerplate: `api/` (GraphQL API on the lys framework), `worker/`
(Celery), `front/` (React + Relay on lys-front), `compose.yaml` (all-Docker local
stack with hot reload). Everything runs with `docker compose up -d` after copying
the `.env.example` files.

## Where the guides live — two sources

**Framework guides ship inside the installed packages** — they always match the
version this project runs:

| Source | Location | Requires |
|--------|----------|----------|
| lys (back) | api container: `/usr/local/lib/python3.13/site-packages/lys/agents/guides/` — host: `python -c "import lys, pathlib; print(pathlib.Path(lys.__file__).parent / 'agents' / 'guides')"` | `runid-lys` ≥ 0.42.0 |
| lys-front (front) | `front/node_modules/lys-front/agents/guides/` | `lys-front` ≥ 0.12.0 |

**Project guides live here**: `agents/guides/` — this project's structure,
conventions, workflows and verification checklist.

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
- **R6 — Never bypass the frameworks.** Back: no direct lys entity/service
  imports — everything through `app_manager` (lys rules guide). Front: no
  GraphQL in elements, respect the layering (`agents/guides/front/architecture.md`).
- **R7 — Verify your work.** After any change, run the self-check checklist in
  `agents/guides/verification.md` and report the results honestly (failures
  included).
- **R8 — Match the surroundings.** Before writing a new component/module, read a
  sibling of the same type and mirror its structure, naming and idioms. The
  reference implementations pointed to by the guides compile and pass tests —
  imitate them.

## ROUTING — read the guide before the task

### Framework mechanics (package guides — see table above)

| Task | Guide (in the package) |
|------|------------------------|
| Back: apps/modules, entities, services, nodes (incl. override by subclassing), webservices, permissions, fixtures, emails/events/notifications, tasks, signals, AI/chatbot tools, consolidated rules | lys `agents/guides/*.md` |
| Front: providers catalog, LysQuery/LysMutation + permission rendering, dialog API, i18n contract, routing/page config fields, signals, chatbot, multi-client focus | lys-front `agents/guides/*.md` |

### This project's conventions (local guides — `agents/guides/`)

| Task | Mandatory guide(s) |
|------|--------------------|
| Any front component (element / feature / restrictedFeature / page) | `front/architecture.md` + the guide for that layer |
| Anything opening in a panel/drawer | `front/dialog.md` (project usage) |
| Page layout / tabs bar / new page template | `front/page-template.md` |
| Provider stack, menus, tabs configs, client selector wiring | `front/app-shell.md` |
| Translations (project conventions) | `front/translations.md` |
| Styling, colors, spacing | `front/style.md` |
| Tests or stories | `front/testing.md` |
| Database schema change (project workflow) | `back/migrations.md` |
| Where the back framework guides are | `back/FRAMEWORK-GUIDES.md` |
| Before reporting done | `verification.md` |

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
agents/guides/              Project guides (this repo's conventions)
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
