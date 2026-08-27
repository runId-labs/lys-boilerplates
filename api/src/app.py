import asyncio
import json
import logging
import uuid
from datetime import datetime, UTC
from typing import AsyncGenerator

import sentry_sdk
from fastapi import Request, HTTPException
from fastapi.responses import StreamingResponse
from lys.core.consts.component_types import AppComponentTypeEnum
from lys.core.consts.environments import EnvironmentEnum
from pythonjsonlogger.json import JsonFormatter
from sqlalchemy import text
from lys.core.managers.app import LysAppManager

from settings import configure_app, sentry_dsn, sentry_traces_sample_rate, SERVICE_NAME

MAX_CHAT_MESSAGE_LENGTH = 10_000
MAX_PAGE_CONTEXT_PARAMS = 20

configure_app()

app_manager = LysAppManager()
app_manager.configure_component_types([
    AppComponentTypeEnum.ENTITIES,
    AppComponentTypeEnum.SERVICES,
    AppComponentTypeEnum.FIXTURES,
    AppComponentTypeEnum.NODES,
    AppComponentTypeEnum.WEBSERVICES,
])

# Configure logging: JSON in production, text in dev
_log_level = getattr(logging, app_manager.settings.log_level)
if app_manager.settings.env != EnvironmentEnum.DEV:
    _handler = logging.StreamHandler()
    _handler.setFormatter(JsonFormatter(
        fmt="%(asctime)s %(levelname)s %(name)s %(message)s",
        rename_fields={"asctime": "timestamp", "levelname": "level"},
    ))
    logging.root.handlers.clear()
    logging.root.addHandler(_handler)
    logging.root.setLevel(_log_level)
else:
    logging.basicConfig(
        level=_log_level,
        format=app_manager.settings.log_format,
    )

# Initialize Sentry (optional — only if SENTRY_DSN is set)
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=app_manager.settings.env.value,
        traces_sample_rate=sentry_traces_sample_rate,
    )

app = app_manager.initialize_app(
    # TODO: Update title and description for your project
    title="Lys API",
    description="API built with lys framework",
    version="1.0.0",
)


@app.get("/health")
async def health_check():
    """Production-ready health check endpoint for container monitoring."""
    checks = {}
    overall_status = "healthy"

    # Database connectivity check
    try:
        async with app_manager.database.get_session() as session:
            await session.execute(text("SELECT 1"))
        checks["database"] = "healthy"
    except Exception as e:
        checks["database"] = "unhealthy"
        overall_status = "unhealthy"

    # Memory usage check
    try:
        import psutil
        memory_percent = psutil.virtual_memory().percent
        checks["memory"] = {
            "status": "healthy" if memory_percent < 85 else "warning",
            "usage_percent": memory_percent
        }
    except ImportError:
        checks["memory"] = "not_available"

    return {
        "status": overall_status,
        "service": SERVICE_NAME,
        "checks": checks,
        "timestamp": datetime.now(UTC).isoformat(),
        "version": "1.0.0"
    }


@app.get("/health/ready")
async def readiness_check():
    """Kubernetes readiness probe - lightweight check for traffic routing."""
    return {
        "status": "ready",
        "service": SERVICE_NAME,
        "timestamp": datetime.now(UTC).isoformat()
    }


# =============================================================================
# SSE Endpoint (real-time signals)
# =============================================================================

async def signal_event_generator(request: Request, channel: str) -> AsyncGenerator[str, None]:
    """
    Generate SSE events from Redis PubSub.

    Uses a timeout-based approach to periodically check for client disconnect
    and allow graceful server shutdown.
    """
    if not app_manager.pubsub:
        raise HTTPException(status_code=503, detail="PubSub not configured")

    if not app_manager.pubsub._async_redis:
        raise HTTPException(status_code=503, detail="PubSub async not initialized")

    full_channel = app_manager.pubsub._build_channel(channel)
    pubsub = app_manager.pubsub._async_redis.pubsub()

    try:
        await pubsub.subscribe(full_channel)
        logging.info(f"SSE client subscribed to: {full_channel}")

        while True:
            # Check if client disconnected
            if await request.is_disconnected():
                logging.info(f"SSE client disconnected from: {full_channel}")
                break

            try:
                # Use timeout to allow periodic disconnect checks
                message = await asyncio.wait_for(
                    pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0),
                    timeout=15.0  # Check disconnect every 15s max
                )

                if message and message["type"] == "message":
                    data = message["data"]
                    if isinstance(data, bytes):
                        data = data.decode("utf-8")

                    try:
                        parsed = json.loads(data)
                        event_data = json.dumps({
                            "channel": channel,
                            "signal": parsed.get("signal", ""),
                            "params": parsed.get("params")
                        })
                        yield f"data: {event_data}\n\n"
                    except json.JSONDecodeError:
                        logging.warning(f"Invalid JSON in channel {full_channel}: {data}")

            except asyncio.TimeoutError:
                # Send heartbeat to keep connection alive and check client status
                yield ": heartbeat\n\n"

    except asyncio.CancelledError:
        logging.info(f"SSE connection cancelled for: {full_channel}")
    except GeneratorExit:
        logging.info(f"SSE generator exit for: {full_channel}")
    finally:
        await pubsub.unsubscribe(full_channel)
        await pubsub.close()
        logging.info(f"SSE cleanup complete for: {full_channel}")


# =============================================================================
# SSE Chat Endpoint (streaming chatbot)
# =============================================================================

@app.post("/sse/chat")
async def sse_chat(request: Request):
    """
    SSE endpoint for streaming chatbot responses.

    POST /sse/chat
    Body: {"message": "...", "conversationId": "...", "context": {"pageName": "...", "params": {...}}}
    """
    connected_user = getattr(request.state, "connected_user", None)
    if not connected_user:
        raise HTTPException(status_code=401, detail="Authentication required")

    access_token = getattr(request.state, "access_token", None)
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token required")

    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    message_text = body.get("message", "").strip()
    if not message_text:
        raise HTTPException(status_code=400, detail="Message is required")
    if len(message_text) > MAX_CHAT_MESSAGE_LENGTH:
        raise HTTPException(status_code=400, detail=f"Message exceeds maximum length of {MAX_CHAT_MESSAGE_LENGTH}")

    conversation_id = body.get("conversationId")
    if conversation_id is not None:
        try:
            uuid.UUID(conversation_id)
        except (ValueError, AttributeError):
            raise HTTPException(status_code=400, detail="Invalid conversation ID format")

    context_raw = body.get("context")

    # Parse page context
    page_context = None
    if context_raw and isinstance(context_raw, dict) and context_raw.get("pageName"):
        params = context_raw.get("params")
        if params is not None:
            if not isinstance(params, dict) or len(params) > MAX_PAGE_CONTEXT_PARAMS:
                raise HTTPException(status_code=400, detail="Invalid context params")
        from lys.apps.ai.modules.conversation.models import PageContextModel
        page_context = PageContextModel(
            page_name=context_raw["pageName"],
            params=params,
        )

    user_id = connected_user["sub"]
    conversation_service = app_manager.get_service("ai_conversations")

    async def chat_event_generator():
        async with app_manager.database.get_session() as session:
            try:
                async for event in conversation_service.chat_with_tools_streaming(
                    user_id=user_id,
                    content=message_text,
                    session=session,
                    connected_user=connected_user,
                    access_token=access_token,
                    conversation_id=conversation_id,
                    page_context=page_context,
                ):
                    if await request.is_disconnected():
                        logging.info("SSE chat client disconnected")
                        break
                    yield event
            except Exception as e:
                logging.error(f"SSE chat error: {e}", exc_info=True)
                yield f"event: error\ndata: {json.dumps({'message': 'An internal error occurred.', 'code': 'INTERNAL_ERROR'})}\n\n"

    return StreamingResponse(
        chat_event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/sse/signals")
async def sse_signals(request: Request, channel: str):
    """
    SSE endpoint for real-time signals.

    GET /sse/signals?channel=user:UUID
    """
    connected_user = getattr(request.state, "connected_user", None)
    if not connected_user:
        raise HTTPException(status_code=401, detail="Authentication required")

    user_id = connected_user["sub"]

    # Security: user can only subscribe to their own channel
    # Channel format: "user:UUID" (raw UUID, decoded on frontend)
    if channel.startswith("user:"):
        channel_user_id = channel.split(":", 1)[1]
        if channel_user_id != user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
    else:
        raise HTTPException(status_code=403, detail="Forbidden")

    return StreamingResponse(
        signal_event_generator(request, channel),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )
# reload test 07:50:53
