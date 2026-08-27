# Development image (default target) — dependencies only, source is
# volume-mounted by compose. Celery has no built-in reload: watchfiles
# restarts the worker on Python file changes.
#
# Production image: docker build --target prod
FROM python:3.13-slim AS dev

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    "runid-lys[all]>=0.41.3,<1.0.0" \
    python-json-logger \
    "sentry-sdk[celery]>=2.0.0,<3.0.0" \
    watchfiles

WORKDIR /app/worker

CMD ["watchfiles", "celery -A worker worker --loglevel=info"]


# ---------------------------------------------------------------------------
# Production
# ---------------------------------------------------------------------------
FROM python:3.13-slim AS builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# TODO: If you have a proprietary library, install it here
# COPY mylib/ /app/mylib/
# RUN pip install --no-cache-dir /app/mylib/

COPY worker/ /app/worker/

RUN pip install --no-cache-dir /app/worker/

# Always upgrade to latest runid-lys with all optional deps from PyPI
RUN pip install --no-cache-dir --upgrade "runid-lys[all]"

FROM python:3.13-slim AS prod

RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq5 && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -r -s /bin/false appuser

COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app

WORKDIR /app/worker

USER appuser

CMD ["celery", "-A", "worker", "worker", "--beat", "--loglevel=info"]
