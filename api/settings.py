import os
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv

from lys.apps.base.consts import CORS_PLUGIN_KEY, CORS_PLUGIN_ALLOW_ORIGINS_KEY, CORS_PLUGIN_ALLOW_METHODS_KEY, \
    CORS_PLUGIN_ALLOW_HEADERS_KEY, CORS_PLUGIN_ALLOW_CREDENTIALS_KEY
from lys.apps.file_management.modules.stored_file.consts import FILE_STORAGE_PLUGIN_KEY, FILE_STORAGE_BACKEND_KEY, \
    FILE_STORAGE_ACCESS_KEY_KEY, FILE_STORAGE_BUCKET_KEY, FILE_STORAGE_SECRET_KEY_KEY, FILE_STORAGE_REGION_KEY, \
    FILE_STORAGE_ENDPOINT_URL_KEY
from lys.apps.legal.modules.legal_document.consts import (
    PRIVACY_POLICY,
    SALES_TERMS,
    TERMS_OF_USE,
)
from lys.apps.user_auth.consts import AUTH_PLUGIN_KEY
from lys.core.configs import settings as app_settings, CelerySettings
from lys.core.consts.environments import EnvironmentEnum
from lys.core.consts.plugins import RATE_LIMIT_PLUGIN_KEY
from sqlalchemy import AsyncAdaptedQueuePool

# Load .env file (relative to this file: api/settings.py -> .env)
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

db_user = os.getenv("DB_USER")
db_pwd = os.getenv("DB_PWD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")
front_url = os.getenv("FRONT_URL", "https://localhost:5173")
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
sentry_dsn = os.getenv("SENTRY_DSN")

# Share of HTTP transactions sent to Sentry/GlitchTip for performance tracing.
# 0.0 by default: transactions are recorded even when nothing fails, and they
# bury the errors we actually watch. Raise it for a few days when
# investigating a specific latency question, then put it back.
sentry_traces_sample_rate = float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.0"))

# TODO: Update service_name to match your project
SERVICE_NAME = "myapp"

# Routes manifest: Docker copies it next to settings.py, dev uses the frontend path
_settings_dir = Path(__file__).parent
_ROUTES_MANIFEST_CANDIDATES = [
    _settings_dir / "routes-manifest.json",
    # Dev fallback: the frontend project next to the api directory
    _settings_dir / ".." / "front" / "public" / "routes-manifest.json",
]


def _resolve_routes_manifest_path() -> str | None:
    for candidate in _ROUTES_MANIFEST_CANDIDATES:
        if candidate.exists():
            return str(candidate.resolve())
    return None


def configure_core():
    """
    Configure core application settings.

    This includes:
    - Environment configuration (DEV/PROD)
    - Secret key
    - Apps to load
    - Middlewares
    - Permissions
    - Plugins (CORS, Auth)

    This function is safe to call without database or external services.
    """
    app_settings.configure(
        env=EnvironmentEnum(os.getenv("ENVIRONMENT", "dev").lower()),
        secret_key=os.getenv("SECRET_KEY"),
        super_user_email=os.getenv("SUPER_USER_EMAIL"),
        super_user_language=os.getenv("SUPER_USER_LANGUAGE", "en"),
        front_url=front_url,
        gateway_server_url=os.getenv("GATEWAY_SERVER_URL", "http://localhost:8000"),
        service_name=SERVICE_NAME,
        relay_max_results=500,
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
            # TODO: Add your custom apps here
            # "myapp.apps.example",
        ],
        middlewares=[
            "lys.core.middlewares.SecurityHeadersMiddleware",
            "lys.core.middlewares.RateLimitMiddleware",
            "lys.apps.user_auth.middlewares.UserAuthMiddleware",
            "lys.apps.base.middlewares.ServiceAuthMiddleware",
            "lys.core.middlewares.ErrorManagerMiddleware",
            "lys.core.middlewares.LysCorsMiddleware",
        ],
        permissions=[
            "lys.apps.base.permissions.InternalServicePermission",
            "lys.apps.user_auth.permissions.AnonymousPermission",
            "lys.apps.user_auth.permissions.JWTPermission",
            # TODO: Add your custom permissions here
        ],
        plugins={
            CORS_PLUGIN_KEY: {
                CORS_PLUGIN_ALLOW_ORIGINS_KEY: [
                    front_url,
                ],
                CORS_PLUGIN_ALLOW_METHODS_KEY: ["GET", "POST", "OPTIONS"],
                CORS_PLUGIN_ALLOW_HEADERS_KEY: ["Authorization", "Content-Type", "X-XSRF-Token"],
                CORS_PLUGIN_ALLOW_CREDENTIALS_KEY: True,
            },
            AUTH_PLUGIN_KEY: {
                # token configurations
                "connection_expire_minutes": 1440,
                "refresh_token_used_once": False,
                "once_refresh_token_expire_minutes": 0,
                "access_token_expire_minutes": 5,
                # cookie configurations
                "cookie_secure": os.getenv("COOKIE_SECURE", "true").lower() == "true",
                "cookie_http_only": True,
                "cookie_same_site": "lax",
                "cookie_domain": None,
                # rate limiting configurations
                "login_rate_limit_enabled": True,
                "login_lockout_durations": {
                    3: 60,      # 1 minute after 3 failed attempts
                    5: 900,     # 15 minutes after 5 failed attempts
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
            "pubsub": {
                "redis_url": redis_url,
                "channel_prefix": SERVICE_NAME,
            },
            RATE_LIMIT_PLUGIN_KEY: {
                "requests_per_minute": int(os.getenv("RATE_LIMIT_RPM", "60")),
                "user_requests_per_minute": int(os.getenv("RATE_LIMIT_USER_RPM", "300")),
                "service_requests_per_minute": int(os.getenv("RATE_LIMIT_SERVICE_RPM", "10000")),
                "enabled": os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true",
            }
        }
    )


def configure_database():
    """
    Configure database connection settings.

    This includes:
    - Database type (PostgreSQL)
    - Connection parameters
    - Pool configuration

    Requires environment variables: DB_HOST, DB_PORT, DB_USER, DB_PWD, DB_NAME
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


def configure_email():
    """
    Configure email sending settings.

    This includes:
    - SMTP server configuration
    - Email sender address
    - Template path

    Requires environment variables: SMTP_SERVER, SMTP_PORT, SMTP_SENDER (optional)
    """
    app_settings.email.configure(
        server=os.getenv("SMTP_SERVER", "localhost"),
        port=int(os.getenv("SMTP_PORT", "1025")),
        sender=os.getenv("SMTP_SENDER", f"noreply@{SERVICE_NAME}.local"),
        login=os.getenv("SMTP_LOGIN", None),
        password=os.getenv("SMTP_PASSWORD", None),
        starttls=os.getenv("SMTP_STARTTLS", "false").lower() == "true",
        template_path="templates/emails",
    )


def configure_mollie():
    """
    Configure Mollie payment integration settings.

    This includes:
    - API key for Mollie API
    - Webhook base URL for ngrok/tunnels (optional, for testing)

    Requires environment variables: MOLLIE_API_KEY
    Optional: MOLLIE_WEBHOOK_BASE_URL
    """
    mollie_api_key = os.getenv("MOLLIE_API_KEY")

    if mollie_api_key:
        front_hostname = urlparse(front_url).hostname
        allowed_domains = [front_hostname] if front_hostname else []

        app_settings.configure_plugin(
            "payment",
            provider="mollie",
            api_key=mollie_api_key,
            webhook_base_url=os.getenv("MOLLIE_WEBHOOK_BASE_URL"),
            allowed_redirect_domains=allowed_domains,
        )


# Default model per provider, used when {PURPOSE}_MODEL is not set explicitly.
_AI_DEFAULT_MODELS = {
    "mistral": os.getenv("AI_MODEL", "mistral-large-latest"),
}


def _ai_endpoint(purpose: str, default_provider: str = "mistral") -> tuple[str, str]:
    """Resolve (provider, model) for an AI endpoint from env, per purpose.

    Each endpoint reads ``{PURPOSE}_PROVIDER`` and ``{PURPOSE}_MODEL`` (e.g.
    ``CHATBOT_PROVIDER=mistral``, ``TEXT_IMPROVEMENT_MODEL=...``), falling back to
    ``default_provider`` and that provider's default model. This makes each endpoint
    switchable independently, with no code change.
    """
    provider = os.getenv(f"{purpose.upper()}_PROVIDER", default_provider)
    model = os.getenv(f"{purpose.upper()}_MODEL") or _AI_DEFAULT_MODELS.get(
        provider, _AI_DEFAULT_MODELS["mistral"]
    )
    return provider, model


def configure_ai():
    """
    Configure AI chatbot plugin.

    This includes:
    - LLM provider and model configuration
    - Tool executor configuration (via GraphQL endpoint)
    - Chatbot system prompt and options
    - Text improvement configuration

    Requires environment variables: MISTRAL_API_KEY
    Optional: AI_MODEL, GATEWAY_SERVER_URL
    """
    chatbot_provider, chatbot_model = _ai_endpoint("chatbot")
    _chatbot_reasoning_effort = os.getenv("CHATBOT_REASONING_EFFORT")
    text_improvement_provider, text_improvement_model = _ai_endpoint("text_improvement")

    app_settings.configure_plugin(
        "ai",
        _keys={
            "mistral": os.getenv("MISTRAL_API_KEY"),
            "anthropic": os.getenv("ANTHROPIC_API_KEY"),
        },
        executor={
            "gateway_url": f"{os.getenv('GATEWAY_SERVER_URL', 'http://localhost:8000')}/graphql",
            "service_name": SERVICE_NAME,
            "timeout": 30,
        },
        chatbot={
            "provider": chatbot_provider,
            "model": chatbot_model,
            "timeout": 60,
            # TODO: Customize the system prompt for your project
            # Versioned: lys records each distinct prompt content in ai_prompt_version
            # at boot and stamps every user turn with the version in force, so answers
            # stay attributable to the prompt that produced them across prompt edits.
            # Any other key of this endpoint that carries prompt text (e.g. a localised
            # summary_header override) must be listed under "prompt_segments" to be
            # versioned the same way.
            "system_prompt": """You are a helpful AI assistant.

Rules:
- Be concise and direct
- Never expose: passwords, tokens, API keys
- Use bold for key figures: **500k**, **+26%**""",
            # Conversation compaction tuning (lys defaults: 120000 / 12).
            "compaction": {
                "token_threshold": 120000,
                "window_messages": 12,
            },
            "options": {
                "temperature": float(os.getenv("CHATBOT_TEMPERATURE", "0.3")),
                # Reasoning-capable models only (e.g. Mistral: "none" or "high").
                # Left unset by default — models without reasoning support return
                # a 400 if it is sent.
                **({"reasoning_effort": _chatbot_reasoning_effort}
                   if _chatbot_reasoning_effort else {}),
                "routes_manifest_path": _resolve_routes_manifest_path(),
            },
        },
        text_improvement={
            "provider": text_improvement_provider,
            "model": text_improvement_model,
            "timeout": 30,
            "options": {
                "temperature": 0.3,
            },
        },
    )


def configure_sso():
    """
    Configure SSO (OAuth2/OIDC) plugin.

    Requires environment variables: MICROSOFT_SSO_CLIENT_ID, MICROSOFT_SSO_CLIENT_SECRET
    Optional: MICROSOFT_SSO_ISSUER_URL, SSO_CALLBACK_BASE_URL

    `multi_tenant` says whether the provider answers for several directories — a client
    signing in with their own company's Microsoft account rather than one of ours. It
    defaults to false: an application that accidentally accepts every directory in the
    world is a worse accident than one that refuses a legitimate client.

    `allowed_tenants` narrows a multi-directory provider to a known list. Empty means
    any directory the provider serves, which for Microsoft means any organisation.
    """

    def _tenant_list(name: str) -> list[str]:
        return [t.strip() for t in os.getenv(name, "").split(",") if t.strip()]

    app_settings.configure_plugin(
        "sso",
        providers={
            "microsoft": {
                "client_id": os.getenv("MICROSOFT_SSO_CLIENT_ID", ""),
                "client_secret": os.getenv("MICROSOFT_SSO_CLIENT_SECRET", ""),
                "issuer_url": os.getenv(
                    "MICROSOFT_SSO_ISSUER_URL",
                    "https://login.microsoftonline.com/common/v2.0"
                ),
                "scopes": ["openid", "email", "profile"],
                "display_name": "Microsoft",
                "multi_tenant": os.getenv("MICROSOFT_SSO_MULTI_TENANT", "false").lower() == "true",
                "allowed_tenants": _tenant_list("MICROSOFT_SSO_ALLOWED_TENANTS"),
            },
            "google": {
                "client_id": os.getenv("GOOGLE_SSO_CLIENT_ID", ""),
                "client_secret": os.getenv("GOOGLE_SSO_CLIENT_SECRET", ""),
                "issuer_url": os.getenv(
                    "GOOGLE_SSO_ISSUER_URL",
                    "https://accounts.google.com"
                ),
                "scopes": ["openid", "email", "profile"],
                "display_name": "Google",
                # Google publishes one issuer for everyone, so this never applies —
                # declared for symmetry, and in case the provider list grows.
                "multi_tenant": os.getenv("GOOGLE_SSO_MULTI_TENANT", "false").lower() == "true",
                "allowed_tenants": _tenant_list("GOOGLE_SSO_ALLOWED_TENANTS"),
            },
        },
        callback_base_url=os.getenv(
            "SSO_CALLBACK_BASE_URL",
            os.getenv("GATEWAY_SERVER_URL", "https://localhost:8000")
        ),
        signup_path="/login",
    )


def configure_celery():
    """
    Configure Celery for background task processing.

    This includes:
    - Broker and result backend configuration
    - Task modules to load
    """
    app_settings.celery = CelerySettings()
    app_settings.celery.configure(
        broker_url=os.getenv("CELERY_BROKER_URL", redis_url),
        result_backend=os.getenv("CELERY_RESULT_BACKEND", redis_url),
        tasks=[
            "lys.apps.base.tasks",
            "lys.apps.user_auth.modules.event.tasks",
            "lys.apps.licensing.tasks",
            "lys.apps.ai.tasks",
            # TODO: Add your custom task modules here
            # "myapp.apps.example.tasks",
        ],
    )


def configure_legal():
    """
    Configure legal documents published at startup by lys.apps.legal.

    Declares the application-owned Markdown sources, keyed by type code, then by
    language. The legal service's on_initialize hook renders each to PDF, stores it,
    and registers an immutable version (idempotent: unchanged sources are cheap
    no-ops). Paths are resolved relative to the api working directory (files shipped
    in the image, under api/legal/).

    This declares content only. Whether a type gates access (requires acceptance) is
    a property of the type, carried by LegalDocumentType.requires_acceptance (seeded
    by the lys fixture), not declared here.

    The shipped sources are DRAFT placeholders — replace them with the project's
    validated legal texts.
    """
    app_settings.legal.documents = {
        TERMS_OF_USE: {
            "languages": {
                "en": {"path": "legal/terms_of_use_en.md"},
            },
        },
        SALES_TERMS: {
            "languages": {
                "en": {"path": "legal/sales_terms_en.md"},
            },
        },
        PRIVACY_POLICY: {
            "languages": {
                "en": {"path": "legal/privacy_policy_en.md"},
            },
        },
    }


def configure_app():
    """
    Configure the complete application.

    This function calls all configuration functions in the correct order:
    1. configure_core() - Core settings (apps, middlewares, permissions, plugins)
    2. configure_database() - Database connection
    3. configure_celery() - Background tasks
    4. configure_email() - Email sending
    5. configure_mollie() - Mollie payment integration
    6. configure_ai() - AI chatbot plugin
    7. configure_sso() - SSO providers

    Use this function when running the full application.
    For schema export, use configure_core() only.
    """
    configure_core()
    configure_database()
    configure_celery()
    configure_email()
    configure_mollie()
    configure_ai()
    configure_sso()
    configure_legal()
