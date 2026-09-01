"""
Server-sent event streams.

Kept out of ``app.py`` so the stream logic can be exercised without booting the
application: the endpoints there own authentication, subscription and cleanup, this
module owns what is written on the wire.
"""

import json
import logging
import random
from time import monotonic
from typing import Any, AsyncGenerator, Awaitable, Callable, Optional

# How long an idle stream may stay silent. Kept well under the idle timeout of any
# proxy in front of the API, and short enough for a client to notice a dead link.
HEARTBEAT_INTERVAL_SECONDS = 15.0

# How often the client disconnection is checked. Independent of the heartbeat: a client
# that left should stop costing a Redis subscription within seconds, not within a beat.
POLL_INTERVAL_SECONDS = 1.0

# Reconnection delay handed to the client for the retries it performs itself. Drawn per
# connection: an API restart drops every stream at once, and a delay shared by all of
# them would bring the whole fleet back on the same instant.
RETRY_MIN_MS = 3000
RETRY_MAX_MS = 8000

# A heartbeat is a named event rather than a comment. A comment keeps proxies from
# closing the stream but is never surfaced by EventSource, which leaves the client
# unable to tell an idle connection from one that stopped being carried. The byte also
# matters on its own: EventSource holds readyState at CONNECTING until the first one.
HEARTBEAT_EVENT = "event: heartbeat\ndata:\n\n"


def retry_directive(rng: random.Random = random) -> str:
    """Build the SSE retry field, jittered per connection."""
    return f"retry: {rng.randint(RETRY_MIN_MS, RETRY_MAX_MS)}\n\n"


def signal_event(channel: str, payload: str) -> Optional[str]:
    """
    Format a published payload as an SSE data event.

    Returns None when the payload is not the expected JSON, so a malformed publication
    is dropped rather than breaking the stream of a connected user.
    """
    try:
        parsed = json.loads(payload)
    except json.JSONDecodeError:
        logging.warning(f"Invalid JSON in channel {channel}: {payload}")
        return None

    return "data: " + json.dumps({
        "channel": channel,
        "signal": parsed.get("signal", ""),
        "params": parsed.get("params"),
    }) + "\n\n"


async def signal_stream(
    channel: str,
    get_message: Callable[[float], Awaitable[Optional[dict[str, Any]]]],
    is_disconnected: Callable[[], Awaitable[bool]],
    heartbeat_interval: float = HEARTBEAT_INTERVAL_SECONDS,
    poll_interval: float = POLL_INTERVAL_SECONDS,
    clock: Callable[[], float] = monotonic,
    rng: random.Random = random,
) -> AsyncGenerator[str, None]:
    """
    Yield the body of a signal stream: an opening burst, then messages and heartbeats.

    The stream opens by writing at once — a client considers itself connected only from
    the first body byte, so an idle channel would otherwise leave it waiting a whole
    heartbeat period while the response head sits there unnoticed.

    :param channel: channel name echoed back in every event
    :param get_message: awaits a published message, returning None after the given timeout
    :param is_disconnected: tells whether the client is gone
    """
    yield retry_directive(rng)
    yield HEARTBEAT_EVENT
    last_write = clock()

    while True:
        if await is_disconnected():
            break

        message = await get_message(poll_interval)

        if message is not None and message.get("type") == "message":
            data = message["data"]
            if isinstance(data, bytes):
                data = data.decode("utf-8")

            event = signal_event(channel, data)
            if event is not None:
                yield event
                last_write = clock()
                continue

        now = clock()
        if now - last_write >= heartbeat_interval:
            yield HEARTBEAT_EVENT
            last_write = now
