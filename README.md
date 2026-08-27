# Lys Boilerplate

Full-stack boilerplate for projects built on the [lys](https://github.com/runid/lys) framework:

- **api/** — GraphQL API (lys apps: auth, users, organizations, licensing, SSO, legal, files, AI)
- **worker/** — Celery worker (lys background tasks)
- **front/** — React + Relay frontend (lys-front)
- **compose.yaml** — the whole local stack, applications included

Everything runs in Docker with hot reload: the API reloads through the lys launcher
(`main.py run --reload`), the worker restarts through `watchfiles`, the frontend through
Vite HMR. The only prerequisite is Docker.

The infrastructure containers are pre-configured for the template values of the
`.env.example` files: a developer copies them to `.env` and everything works locally,
with no production secrets involved.

## Quick start

```bash
cp .env.example .env
cp api/.env.example api/.env
cp worker/.env.example worker/.env
cp front/.env.example front/.env

docker compose up -d
```

| Service | URL / port | Purpose |
|---------|------------|---------|
| API (GraphQL) | http://localhost:8000/graphql | GraphiQL in dev |
| Frontend | http://localhost:5173 | Vite dev server (HMR) |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Pub/sub (SSE signals), Celery broker |
| MinIO | localhost:9000 (console: 9001) | S3-compatible file storage |
| MailHog | localhost:8025 (SMTP: 1025) | Email capture |
| GlitchTip | localhost:3000 | Sentry-compatible error tracking |
| mock-oauth2 | localhost:8080 | Mock OIDC provider (SSO testing) |

The api container applies pending migrations at startup. The first `up` builds the
images (a few minutes); subsequent starts are immediate.

## Daily commands

```bash
docker compose logs -f api          # follow a service's logs
docker compose restart worker       # restart a service

# After editing api/.env or worker/.env (the apps read the mounted file at
# startup — no container recreation needed):
docker compose restart api worker

# Generate a migration after an entity change
docker compose exec api python main.py makemigrations -m "description"

# Regenerate the GraphQL schema + Relay types after an app/webservice change
./bin/generate-schema.sh

# Run inside a container
docker compose exec api bash
docker compose exec front sh

# Dev fixture accounts (users, demo clients): lys generates RANDOM passwords
# at the FIRST boot that seeded them, logged once — retrieve them with:
docker compose logs api | grep "Dev fixture password"
```

## Production images

Each app ships a production stage (no mounted source, no reload):

```bash
docker build --target prod -f api/Dockerfile -t myapp-api .
docker build --target prod -f worker/Dockerfile -t myapp-worker .
docker build --target prod -f front/Dockerfile -t myapp-front front/
```

## Agent guides

`AGENTS.md` (repo root) routes any coding agent — Claude Code, Codex, Cursor… — to the
mandatory guides in `agents/guides/` (front layers, back components, translations,
styling, migrations, rules). Two mechanical guardrails back the docs:

```bash
cd front && npm run lint:boundaries     # front layer import boundaries (ESLint)
docker compose exec api lint-imports    # back: no direct lys entity/service imports
```

## SSO local testing

The compose starts a mock OIDC provider. Uncomment the mock issuer block in `api/.env`
(see the SSO section) and restart the API to sign in through fake Microsoft/Google flows.

## Error tracking local testing

Open GlitchTip at http://localhost:3000, create an account and a project, then paste the
project DSN into `SENTRY_DSN` in `api/.env` and `worker/.env`.

## Developing the lys framework (backend) alongside

The stack runs lys from PyPI by default. To test local lys modifications (even
uncommitted) without any image rebuild, use the opt-in overlay — it mounts your
lys checkout over the installed package and extends the reload watchers, so an
edit in lys restarts the api and worker automatically:

```bash
docker compose -f compose.yaml -f compose.lys-dev.yaml up -d
# custom lys location:
LYS_SRC=/path/to/lys docker compose -f compose.yaml -f compose.lys-dev.yaml up -d
```

## The lys-front dependency

`front/package.json` consumes lys-front through the npm package (`lys-front` is an alias
on `runid-lys`), so the whole stack runs with no framework checkout. To develop lys-front
alongside this project, switch the dependency to the local checkout and run the frontend
on the host:

```json
"lys-front": "file:../../../runid/lys-front"
```

```bash
cd front && rm -rf node_modules package-lock.json && npm install && npm run dev
```
