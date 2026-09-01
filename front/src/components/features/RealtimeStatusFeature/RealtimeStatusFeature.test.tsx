import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {act, screen} from "@testing-library/react";
import renderWithIntl from "@/test/utils";
import RealtimeStatusFeature from "./index";
import {OFFLINE_DISPLAY_DELAY_MS} from "./consts";

const signalState = {isConnected: true};

vi.mock("lys-front/providers", async (importOriginal) => ({
    ...await importOriginal<typeof import("lys-front/providers")>(),
    useSignal: () => ({
        isConnected: signalState.isConnected,
        error: null,
        subscribe: () => () => {},
        subscribeReconnect: () => () => {}
    })
}));

const mockSignal = (isConnected: boolean) => {
    signalState.isConnected = isConnected;
};

describe("RealtimeStatusFeature", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("renders nothing while the connection is up", () => {
        mockSignal(true);
        renderWithIntl(<RealtimeStatusFeature/>);

        act(() => {
            vi.advanceTimersByTime(OFFLINE_DISPLAY_DELAY_MS * 2);
        });

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("stays silent during a short outage", () => {
        mockSignal(false);
        renderWithIntl(<RealtimeStatusFeature/>);

        act(() => {
            vi.advanceTimersByTime(OFFLINE_DISPLAY_DELAY_MS - 1);
        });

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("shows the indicator once the outage lasts", () => {
        mockSignal(false);
        renderWithIntl(<RealtimeStatusFeature/>);

        act(() => {
            vi.advanceTimersByTime(OFFLINE_DISPLAY_DELAY_MS);
        });

        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("hides the indicator when the connection comes back", () => {
        mockSignal(false);
        const {rerender} = renderWithIntl(<RealtimeStatusFeature/>);

        act(() => {
            vi.advanceTimersByTime(OFFLINE_DISPLAY_DELAY_MS);
        });
        expect(screen.getByRole("status")).toBeInTheDocument();

        mockSignal(true);
        act(() => {
            rerender(<RealtimeStatusFeature/>);
        });

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
});
