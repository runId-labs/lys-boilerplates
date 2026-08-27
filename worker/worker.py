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

# Export for celery command
app = celery_app
