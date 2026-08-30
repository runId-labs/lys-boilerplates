"""
Celery worker entry point.

Usage:
    cd worker
    celery -A worker worker --loglevel=info

    # Start beat scheduler
    celery -A worker beat --loglevel=info

    # Start both (development only)
    celery -A worker worker --beat --loglevel=info
"""

import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration

from settings import configure_app, sentry_dsn, sentry_traces_sample_rate
from lys.core.configs import settings
from lys.core.celery_app import create_celery_app

# Configure application settings (includes Celery configuration)
configure_app()

# Initialize Sentry (optional — only if SENTRY_DSN is set)
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=settings.env.value,
        integrations=[CeleryIntegration()],
        traces_sample_rate=sentry_traces_sample_rate,
    )

# Create Celery app (loads ENTITIES and SERVICES, initializes pubsub on worker_process_init)
celery_app = create_celery_app(settings)

# Acknowledge a task once it has finished, not when it is received. With the default
# early acknowledgements a task lost with its worker — an eviction, an OOM kill, a
# SIGKILL after the grace period — is never redelivered: the broker considers it
# handled, and nothing anywhere records that it did not run.
#
# Safe because long tasks should already guard against a duplicate run (Redis lock,
# idempotency check): a redelivery that finds the work already done returns without
# re-executing it. A task that is NOT idempotent must be made so before these
# settings are safe — check your task implementations.
#
# These two settings are generic Celery concerns and belong in lys' CelerySettings,
# which does not expose them yet; they are set on the app here until it does.
celery_app.conf.task_acks_late = True
celery_app.conf.task_reject_on_worker_lost = True

# Export for celery command
app = celery_app
