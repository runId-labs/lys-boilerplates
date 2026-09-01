import {describe, it, expect} from "vitest";
import {screen} from "@testing-library/react";
import renderWithIntl from "@/test/utils";
import RealtimeStatusElement from "./index";

describe("RealtimeStatusElement", () => {
    it("renders the default offline label", () => {
        renderWithIntl(<RealtimeStatusElement/>);

        expect(screen.getByRole("status")).toHaveTextContent("Offline");
    });

    it("renders the default explanation as tooltip", () => {
        renderWithIntl(<RealtimeStatusElement/>);

        expect(screen.getByRole("status")).toHaveAttribute("title", "Live updates are interrupted. Reconnecting…");
    });

    it("accepts a custom label and title", () => {
        renderWithIntl(<RealtimeStatusElement label="Disconnected" title="Custom detail"/>);

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("Disconnected");
        expect(status).toHaveAttribute("title", "Custom detail");
    });

    it("applies additional class names", () => {
        renderWithIntl(<RealtimeStatusElement className="ms-2"/>);

        expect(screen.getByRole("status")).toHaveClass("realtime-status-element", "ms-2");
    });
});
