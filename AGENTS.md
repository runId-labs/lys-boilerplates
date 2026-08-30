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
- **R3 — ⛔ NO COMMIT. NO PUSH. NO DB DELETE. NO DB MODIFY. ⛔**
  **WITHOUT AN EXPLICIT, UNAMBIGUOUS "COMMIT" OR "PUSH" INSTRUCTION FROM THE USER.**
  Implementing is NOT committing. A compliment is NOT a commit order.
  A nod of approval is NOT a push order. A design agreement is NOT a push order.
  If you are unsure whether the user just gave you permission to commit or
  push: **ASK. DO NOT GUESS. DO NOT ASSUME.**
  This rule has ZERO tolerance. Violating it is a breach of trust.
  Applies to: git commit, git push, database DROP/DELETE/TRUNCATE/ALTER,
  file deletion outside the current task scope.
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
- **R9 — Trace the full chain.** Before reporting a change done, walk the ENTIRE
  chain that the subject touches — not just the file or layer you edited. A
  change on the front may break the API contract, a task payload, an email
  template, a signal consumer, or an external automation. The implementation
  is organic: every piece feeds others, and a change that looks local can
  introduce bugs three layers away.

  **What to check, at minimum:**

  | You changed… | Also check… |
  |--------------|-------------|
  | Front component (props, data shape) | The GraphQL query/fragment that feeds it, the backend webservice's return shape, any signal consumer that refreshes it |
  | Front GraphQL query/mutation | The backend node/webservice signature, the Relay generated types, every component that shares the fragment |
  | Backend entity (column, type, constraint) | Every service that reads/writes it, every node that exposes it, every front query that selects it, the migration |
  | Backend webservice (signature, permission) | Every front restrictedFeature that calls it, the routes manifest, the permission chain |
  | Backend task / signal | Every front subscriber (`useSignalSubscription`), the notification list/bell formatters |
  | Email template / event type | The worker's `templates/emails/` (both api AND worker), the translations.json, the front notification formatters |
  | Any `.env` variable | Both `api/settings.py` AND `worker/settings.py`, the compose services, the `.env.example` documentation |

  If you cannot confidently say "I checked every consumer of what I changed",
  you are not done. List what you did NOT check in your report — the user
  decides whether the gap is acceptable, not you.

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

## Quality bar — the three-lens review (MANDATORY)

Every piece of code produced, every business rule implemented, every review
delivered is held to **industry-grade standard** — not student-project level.
When writing, reviewing, or discussing an implementation, evaluate through
these three lenses, in this order:

### Lens 1 — Cleanliness (structural quality)

Does the code meet the structural standards of the industry and this stack?

- Framework conventions respected (lys registration, layer separation,
  naming, i18n, no raw values — see the guides).
- Industry code standards: PEP 8 / TypeScript strict, separation of
  responsibilities, single-responsibility functions, no dead code, no
  copy-paste duplication.
- Architecture: the right concern in the right layer, no lateral
  dependencies between modules that should be independent.
- A reviewer seeing this code in a premium product would not flag it.

### Lens 2 — Correctness (industry-grade logic)

Is the logic what the industry expects from a **paid, production-grade
application** — no more, no less?

- **No simplistic shortcuts**: school-project patterns (hardcoded edge
  cases, single-user assumptions, happy-path-only logic) are unacceptable.
- **No over-engineering either**: speculative abstractions, unnecessary
  configurability, gold-plating are equally unacceptable. The equilibrium
  IS the industry standard.
- **Use existing wheels**: if the framework, the language, or a established
  library already solves the problem, use it. Reinventing a (worse) version
  of a solved problem is a defect, not a contribution.
- **No atypical behavior**: the logic should behave the way a competent
  practitioner in the domain expects it to. Surprising behavior (even if
  technically correct) is a design flaw.
- **If the developer (or agent) is drifting** toward either extreme
  (naive or baroque), the review must say so explicitly.

### Lens 3 — Safety (attack surface AND data integrity)

Is the code safe against both malicious input AND its own failure paths?

- **Attack surface**: the strict industry definition — injection, access
  control, information leakage, authentication/authorization bypass. Every
  input validated; every output that varies by user checked.
- **Data integrity** (the one reviews forget): read the code as a sequence
  of state changes and ask *"if an exception hits HERE, what does the
  database look like?"*
  - Is the ordering of writes correct? (Save A then B, not B then A.)
  - Is there a window where half the data is saved and the other half
    is lost?
  - Does a rollback leave the system in a coherent state?
  - Are concurrent accesses to the same data serialized or guarded?
  - If the answer to any of these is "half the data is gone" or "both
    halves written twice", that is a safety defect, not a style issue.

### Applying the lenses

| Situation | What to do |
|-----------|------------|
| Writing new code | Self-check all three lenses before reporting done |
| Reviewing code | Evaluate through each lens explicitly; a review that only checks cleanliness is incomplete |
| Designing a feature | Discuss correctness (lens 2) first; safety (lens 3) shapes the design; cleanliness (lens 1) shapes the implementation |
| User asks "is this good?" | Answer per-lens, not with a global "yes" or "no" |
