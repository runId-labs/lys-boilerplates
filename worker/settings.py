"""Worker settings — shares DB and apps config with the API."""
import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from pythonjsonlogger.json import JsonFormatter

# Load .env early to read ENVIRONMENT for logging config
_env_path = Path(__file__).parent / ".env"
load_dotenv(_env_path)

environment = os.getenv("ENVIRONMENT", "dev")
sentry_dsn = os.getenv("SENTRY_DSN")

# Share of Celery transactions traced for performance (keep low — see api/.env.example)
sentry_traces_sample_rate = float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.0"))


# Configure logging: JSON in production, text in dev
if environment.upper() != "DEV":
    _handler = logging.StreamHandler()
    _handler.setFormatter(JsonFormatter(
        fmt="%(asctime)s %(levelname)s %(name)s %(message)s",
        rename_fields={"asctime": "timestamp", "levelname": "level"},
    ))
    logging.root.handlers.clear()
    logging.root.addHandler(_handler)
    logging.root.setLevel(logging.INFO)
else:
    logging.basicConfig(level=logging.DEBUG)

from lys.apps.base.consts import CORS_PLUGIN_KEY, CORS_PLUGIN_ALLOW_ORIGINS_KEY, CORS_PLUGIN_ALLOW_METHODS_KEY, \
    CORS_PLUGIN_ALLOW_HEADERS_KEY, CORS_PLUGIN_ALLOW_CREDENTIALS_KEY
from lys.apps.file_management.modules.stored_file.consts import (
    FILE_STORAGE_PLUGIN_KEY, FILE_STORAGE_BACKEND_KEY, FILE_STORAGE_ACCESS_KEY_KEY,
    FILE_STORAGE_BUCKET_KEY, FILE_STORAGE_SECRET_KEY_KEY, FILE_STORAGE_REGION_KEY,
    FILE_STORAGE_ENDPOINT_URL_KEY,
)
from lys.apps.user_auth.consts import AUTH_PLUGIN_KEY
from celery.schedules import crontab
from lys.core.configs import settings as app_settings, CelerySettings
from lys.core.consts.environments import EnvironmentEnum
from sqlalchemy import AsyncAdaptedQueuePool

# TODO: Update service_name to match your project (keep the "-worker" suffix)
SERVICE_NAME = "myapp-worker"

db_user = os.getenv("DB_USER")
db_pwd = os.getenv("DB_PWD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")


def configure_core():
    """
    Configure core application settings.

    The worker loads the same lys apps as the API (it runs their tasks and touches
    their entities/services). Keep both app lists in sync when adding an app.
    """
    app_settings.configure(
        env=EnvironmentEnum(environment.lower()),
        secret_key=os.getenv("SECRET_KEY"),
        gateway_server_url=os.getenv("GATEWAY_SERVER_URL", "http://localhost:8000"),
        service_name=SERVICE_NAME,
        apps=[
            "lys.apps.base",
            "lys.apps.user_auth",
            "lys.apps.user_role",
            "lys.apps.organization",
            "lys.apps.sso",
            "lys.apps.licensing",
            "lys.apps.legal",
            "lys.apps.file_management",
            "lys.apps.ai",
            # TODO: Add your custom apps here (must match the API app list)
        ],
        middlewares=[
            "lys.core.middlewares.SecurityHeadersMiddleware",
            "lys.apps.user_auth.middlewares.UserAuthMiddleware",
            "lys.core.middlewares.ErrorManagerMiddleware",
            "lys.core.middlewares.LysCorsMiddleware",
        ],
        permissions=[
            "lys.apps.user_auth.permissions.AnonymousPermission",
            "lys.apps.user_auth.permissions.JWTPermission",
        ],
        plugins={
            CORS_PLUGIN_KEY: {
                CORS_PLUGIN_ALLOW_ORIGINS_KEY: ["*"],
                CORS_PLUGIN_ALLOW_METHODS_KEY: ["*"],
                CORS_PLUGIN_ALLOW_HEADERS_KEY: ["*"],
                CORS_PLUGIN_ALLOW_CREDENTIALS_KEY: True,
            },
            AUTH_PLUGIN_KEY: {
                "connection_expire_minutes": 1440,
                "refresh_token_used_once": False,
                "once_refresh_token_expire_minutes": 0,
                "access_token_expire_minutes": 5,
                "check_xsrf_token": False,
                "cookie_secure": os.getenv("COOKIE_SECURE", "true").lower() == "true",
                "cookie_http_only": True,
                "cookie_same_site": "lax",
                "cookie_domain": None,
                "login_rate_limit_enabled": True,
                "login_lockout_durations": {
                    3: 60,
                    5: 900,
                }
            },
            FILE_STORAGE_PLUGIN_KEY: {
                FILE_STORAGE_BACKEND_KEY: "s3",
                FILE_STORAGE_BUCKET_KEY: os.getenv("S3_BUCKET", "app-files"),
                FILE_STORAGE_ACCESS_KEY_KEY: os.getenv("AWS_ACCESS_KEY_ID"),
                FILE_STORAGE_SECRET_KEY_KEY: os.getenv("AWS_SECRET_ACCESS_KEY"),
                FILE_STORAGE_REGION_KEY: os.getenv("AWS_REGION", "eu-west-1"),
                FILE_STORAGE_ENDPOINT_URL_KEY: os.getenv("S3_ENDPOINT_URL"),
            },
            "ai": {
                "_keys": {
                    "mistral": os.getenv("MISTRAL_API_KEY"),
                    "anthropic": os.getenv("ANTHROPIC_API_KEY"),
                },
                # Conversation compaction runs in the worker (summarize_conversation
                # task). Cheap model; the prompt preserves the conversation language
                # and attributes each fact to its subject.
                "conversation_summary": {
                    "provider": os.getenv("CONVERSATION_SUMMARY_PROVIDER", "mistral"),
                    "model": os.getenv("CONVERSATION_SUMMARY_MODEL", "mistral-small-latest"),
                    "timeout": 60,
                    "system_prompt": (
                        "Tu maintiens un résumé continu du début d'une conversation pour qu'elle "
                        "tienne dans un contexte limité. À partir du résumé précédent (s'il existe) "
                        "et du lot de messages suivant, produis un résumé unique et mis à jour qui "
                        "conserve chaque fait utile à la décision, chaque question ouverte et chaque "
                        "intention de l'utilisateur. Rattache chaque fait à son sujet précis "
                        "(société, année, thème) pour ne jamais confondre deux sujets distincts. "
                        "Garde les noms, chiffres et identifiants à l'identique. Rédige le résumé "
                        "dans la langue de la conversation. Ne produis que le résumé, sans préambule."
                    ),
                    "options": {
                        "temperature": 0.2,
                    },
                },
                # TODO: Add worker-side AI endpoints here (analysis, extraction...),
                # resolved per purpose from {PURPOSE}_PROVIDER / {PURPOSE}_MODEL env vars.
            },
            "pubsub": {
                "redis_url": os.getenv("REDIS_URL", "redis://localhost:6379/0"),
                # Must match the API prefix: both processes publish on the same channels
                "channel_prefix": "myapp",
            },
        }
    )


def configure_database():
    """
    Configure database connection settings.
    """
    app_settings.database.configure(
        type="postgresql",
        host=db_host,
        port=int(db_port),
        username=db_user,
        password=db_pwd,
        database=db_name,
        poolclass=AsyncAdaptedQueuePool,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        pool_recycle=3600,
        echo=False,
        ssl_mode=os.getenv("DB_SSL_MODE", None),
    )


def configure_celery():
    """
    Configure Celery for background task processing.

    This includes:
    - Broker and result backend configuration
    - Task modules to load
    - Beat schedule for periodic tasks
    """
    app_settings.celery = CelerySettings()
    app_settings.celery.configure(
        broker_url=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
        result_backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0"),
        tasks=[
            "lys.apps.base.tasks",
            "lys.apps.user_auth.modules.event.tasks",
            "lys.apps.licensing.tasks",
            "lys.apps.ai.tasks",
            # TODO: Add your custom task modules here
        ],
    )

    # Configure Celery Beat schedule
    app_settings.celery.beat_schedule = {
        "apply-pending-plan-changes-daily": {
            "task": "lys.apps.licensing.tasks.apply_pending_plan_changes",
            "schedule": crontab(hour=1, minute=0),
        },
    }


def configure_email():
    """
    Configure email sending settings.
    """
    app_settings.email.configure(
        server=os.getenv("SMTP_SERVER", "localhost"),
        port=int(os.getenv("SMTP_PORT", "1025")),
        sender=os.getenv("SMTP_SENDER", "noreply@myapp.local"),
        login=os.getenv("SMTP_LOGIN", None),
        password=os.getenv("SMTP_PASSWORD", None),
        starttls=os.getenv("SMTP_STARTTLS", "false").lower() == "true",
        template_path="templates/emails",
    )


def configure_app():
    """
    Configure the complete worker application.
    """
    configure_core()
    configure_database()
    configure_celery()
    configure_email()
# reload test 07:51:05
# reload test 07:52:08
