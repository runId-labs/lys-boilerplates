import {describe, it, expect} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import CountBadgeElement from "./index";

const mockItems = ["Admin", "User", "Editor"];

describe("CountBadgeElement", () => {
    describe("Rendering", () => {
        it("renders count as badge", () => {
            render(<CountBadgeElement items={mockItems} />);
            expect(screen.getByText("3")).toBeInTheDocument();
        });

        it("renders emptyDisplay when no items", () => {
            render(<CountBadgeElement items={[]} />);
            expect(screen.getByText("-")).toBeInTheDocument();
        });

        it("renders custom emptyDisplay", () => {
            render(<CountBadgeElement items={[]} emptyDisplay="N/A" />);
            expect(screen.getByText("N/A")).toBeInTheDocument();
        });

        it("renders emptyDisplay for null items", () => {
            render(<CountBadgeElement items={null as any} />);
            expect(screen.getByText("-")).toBeInTheDocument();
        });
    });

    describe("Badge styling", () => {
        it("uses secondary variant by default", () => {
            const {container} = render(<CountBadgeElement items={mockItems} />);
            expect(container.querySelector(".bg-secondary")).toBeInTheDocument();
        });

        it("supports custom variant", () => {
            const {container} = render(<CountBadgeElement items={mockItems} variant="primary" />);
            expect(container.querySelector(".bg-primary")).toBeInTheDocument();
        });

        it("renders as pill badge", () => {
            const {container} = render(<CountBadgeElement items={mockItems} />);
            expect(container.querySelector(".rounded-pill")).toBeInTheDocument();
        });

        it("applies custom className", () => {
            const {container} = render(
                <CountBadgeElement items={mockItems} className="custom-badge" />
            );
            expect(container.querySelector(".custom-badge")).toBeInTheDocument();
        });
    });

    describe("Popover", () => {
        it("shows popover on hover by default", async () => {
            render(<CountBadgeElement items={mockItems} />);
            const badge = screen.getByText("3");
            fireEvent.mouseOver(badge);
            // Wait for popover
            expect(await screen.findByText("Admin")).toBeInTheDocument();
            expect(await screen.findByText("User")).toBeInTheDocument();
            expect(await screen.findByText("Editor")).toBeInTheDocument();
        });

        it("shows popover title when provided", async () => {
            render(<CountBadgeElement items={mockItems} popoverTitle="Roles" />);
            const badge = screen.getByText("3");
            fireEvent.mouseOver(badge);
            expect(await screen.findByText("Roles")).toBeInTheDocument();
        });

        it("does not show popover when disabled", () => {
            render(<CountBadgeElement items={mockItems} showPopover={false} />);
            const badge = screen.getByText("3");
            fireEvent.mouseOver(badge);
            // Items should not be visible without popover
            expect(screen.queryByText("Admin")).not.toBeInTheDocument();
        });
    });

    describe("Single item", () => {
        it("renders count of 1 for single item", () => {
            render(<CountBadgeElement items={["Admin"]} />);
            expect(screen.getByText("1")).toBeInTheDocument();
        });
    });
});
