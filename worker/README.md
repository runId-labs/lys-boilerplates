# Lys Worker Boilerplate

Celery worker for the lys boilerplate — runs the lys background tasks (base jobs, user events, licensing plan changes, AI conversation compaction).

## Quick start

```bash
# 1. Configure environment (same values as api/.env)
cp .env.example .env

# 2. Install dependencies
pip install -e ".[dev]"

# 3. Run the worker (development)
celery -A worker worker --loglevel=info

# Or with the beat scheduler (development only)
celery -A worker worker --beat --loglevel=info
```

## Notes

- The app list in `settings.py` must stay in sync with `api/settings.py`: the worker loads the same lys apps to run their tasks and touch their entities/services.
- The `channel_prefix` (pubsub) must match the API's, so both processes publish on the same Redis channels.
- Add custom AI endpoints (analysis, extraction…) in `configure_core()`, resolved per purpose from `{PURPOSE}_PROVIDER` / `{PURPOSE}_MODEL` env vars.
