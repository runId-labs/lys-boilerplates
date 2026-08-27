# Lys API Boilerplate

GraphQL API built on the [lys](https://github.com/runid/lys) framework (PyPI: `runid-lys`).

## Quick start

```bash
# 1. Configure environment
cp .env.example .env   # then set at least SECRET_KEY and DATABASE_*

# 2. Install dependencies
pip install -e ".[dev]"

# 3. Apply database migrations
python main.py migrate

# 4. Run the API (dev)
python main.py run --port 8000
```

## Commands

| Command | Description |
|---------|-------------|
| `python main.py run` | Start the API server (uvicorn) |
| `python main.py makemigrations -m "..."` | Generate an Alembic migration from entity changes |
| `python main.py migrate` | Apply pending migrations |
| `python main.py db-status` | Show current migration revision |
| `python main.py export-schema` | Export the GraphQL schema (used by the front Relay compiler) |

## Registered lys apps

`base`, `user_auth`, `user_role`, `organization`, `sso`, `licensing`, `legal`, `file_management`, `ai` — see `settings.py` to add your own apps.

## GraphQL schema for the frontend

The schema consumed by `front/schema.graphql` is exported from this API:

```bash
./bin/generate-schema.sh   # from the repository root
```

## Structure

- `settings.py` — app registry, middlewares, permissions, plugins (DB, auth, storage, AI, SSO…)
- `src/app.py` — FastAPI entrypoint (health, SSE chat, SSE signals)
- `main.py` — Typer CLI
- `migrations/` — Alembic migrations
