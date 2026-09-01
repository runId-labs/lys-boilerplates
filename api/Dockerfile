# Development image (default target) — dependencies only, source is
# volume-mounted by compose; reload is handled by the lys launcher
# (python main.py run --reload).
#
# Production image: docker build --target prod
FROM python:3.13-slim AS dev

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    "runid-lys[all]>=0.44.1,<1.0.0" \
    python-json-logger \
    "sentry-sdk[fastapi]>=2.0.0,<3.0.0" \
    psutil \
    import-linter

WORKDIR /app/api

EXPOSE 8000

CMD ["sh", "-c", "python main.py migrate && python main.py run --host 0.0.0.0 --port 8000 --reload"]


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

COPY api/ /app/api/

RUN pip install --no-cache-dir /app/api/

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

WORKDIR /app/api

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health/ready')"

CMD ["sh", "-c", "python main.py migrate && python main.py run --host 0.0.0.0 --port 8000"]
