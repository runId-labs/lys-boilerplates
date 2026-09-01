"""
Tests for the signal stream.

The stream once stayed byte-silent for the whole life of a connection: the heartbeat sat
behind an ``asyncio.TimeoutError`` that ``get_message`` never raises, so the branch was
dead and clients never saw the connection open. These tests pin the writes.
"""

import json
import random

import pytest

from src.sse import (
    HEARTBEAT_EVENT,
    RETRY_MAX_MS,
    RETRY_MIN_MS,
    retry_directive,
    signal_event,
    signal_stream,
)

CHANNEL = "user:0b6d1a1e"
HEARTBEAT_INTERVAL = 15.0
POLL = 1.0


class FakeClock:
    """Monotonic clock advanced by the polls the stream performs."""

    def __init__(self):
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


def make_source(script, clock: FakeClock):
    """
    Build a get_message that replays `script` — None meaning "nothing came in".

    Each call advances the clock by the poll interval, as a real wait would.
    """
    pending = list(script)

    async def get_message(timeout: float):
        clock.now += timeout
        return pending.pop(0) if pending else None

    return get_message


def make_disconnect(after: int):
    """Report the client gone from the `after`-th check on."""
    checks = {"count": 0}

    async def is_disconnected() -> bool:
        checks["count"] += 1
        return checks["count"] > after

    return is_disconnected


async def collect(script, disconnect_after: int, clock: FakeClock | None = None) -> list[str]:
    clock = clock or FakeClock()
    events = []
    stream = signal_stream(
        CHANNEL,
        make_source(script, clock),
        make_disconnect(disconnect_after),
        heartbeat_interval=HEARTBEAT_INTERVAL,
        poll_interval=POLL,
        clock=clock,
        rng=random.Random(1),
    )
    async for event in stream:
        events.append(event)
    return events


def published(signal: str, params: dict | None = None) -> dict:
    return {"type": "message", "data": json.dumps({"signal": signal, "params": params})}


@pytest.mark.asyncio
async def test_opens_with_a_retry_directive_and_a_heartbeat():
    """A client holds readyState at CONNECTING until the first byte: never open silent."""
    events = await collect([], disconnect_after=0)

    assert events[0].startswith("retry: ")
    assert events[1] == HEARTBEAT_EVENT


@pytest.mark.asyncio
async def test_beats_when_nothing_is_published():
    """The regression: an idle channel must still write, once per interval."""
    # 30 polls of 1s, nothing published
    events = await collect([None] * 30, disconnect_after=30)

    beats_after_opening = events[2:]
    assert beats_after_opening == [HEARTBEAT_EVENT, HEARTBEAT_EVENT]


@pytest.mark.asyncio
async def test_does_not_beat_while_signals_flow():
    """A published event is a written byte: it postpones the heartbeat."""
    script = []
    for _ in range(3):
        script.extend([None] * 10)
        script.append(published("FINANCIAL_IMPORT_COMPLETED"))

    events = await collect(script, disconnect_after=len(script))

    assert HEARTBEAT_EVENT not in events[2:]
    assert len([e for e in events if e.startswith("data: ")]) == 3


@pytest.mark.asyncio
async def test_forwards_a_published_signal():
    events = await collect([published("IRS_COMPUTED", {"year": 2025})], disconnect_after=1)

    payload = json.loads(events[2].removeprefix("data: ").strip())
    assert payload == {"channel": CHANNEL, "signal": "IRS_COMPUTED", "params": {"year": 2025}}


@pytest.mark.asyncio
async def test_drops_a_malformed_payload_without_breaking_the_stream():
    script = [{"type": "message", "data": "not json"}, published("IRS_COMPUTED")]

    events = await collect(script, disconnect_after=2)

    assert len([e for e in events if e.startswith("data: ")]) == 1


@pytest.mark.asyncio
async def test_stops_when_the_client_is_gone():
    """The check runs per poll, not per heartbeat: a departed client is released fast."""
    clock = FakeClock()
    await collect([None] * 50, disconnect_after=3, clock=clock)

    assert clock.now == pytest.approx(3 * POLL)


def test_retry_directive_is_drawn_per_connection():
    """A shared delay would bring every browser back on the same instant after a restart."""
    values = {retry_directive(random.Random(seed)) for seed in range(50)}

    assert len(values) > 1
    for value in values:
        assert RETRY_MIN_MS <= int(value.removeprefix("retry: ").strip()) <= RETRY_MAX_MS


def test_signal_event_returns_none_on_invalid_json():
    assert signal_event(CHANNEL, "{oops") is None
