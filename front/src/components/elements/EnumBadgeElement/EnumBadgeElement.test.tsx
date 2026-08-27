import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import EnumBadgeElement from "./index";

const statusValues = {
    DRAFT: {variant: "secondary" as const, label: "Draft"},
    IN_PROGRESS: {variant: "primary" as const, label: "In progress", description: "Work has started"},
    DONE: {variant: "success" as const, label: "Done"}
};

describe("EnumBadgeElement", () => {
    describe("Rendering", () => {
        it("renders the configured label", () => {
            render(<EnumBadgeElement code="DRAFT" values={statusValues} />);
            expect(screen.getByText("Draft")).toBeInTheDocument();
        });

        it("applies the configured variant", () => {
            render(<EnumBadgeElement code="DONE" values={statusValues} />);
            expect(screen.getByText("Done").closest(".badge")).toHaveClass("bg-success");
        });

        it("falls back to the raw code when no label is configured", () => {
            render(<EnumBadgeElement code="ARCHIVED" values={statusValues} />);
            expect(screen.getByText("ARCHIVED")).toBeInTheDocument();
        });

        it("falls back to secondary variant for unknown codes", () => {
            render(<EnumBadgeElement code="UNKNOWN" values={statusValues} />);
            expect(screen.getByText("UNKNOWN").closest(".badge")).toHaveClass("bg-secondary");
        });

        it("renders extra children after the label", () => {
            render(
                <EnumBadgeElement code="DRAFT" values={statusValues}>
                    <span data-testid="count">3</span>
                </EnumBadgeElement>
            );
            expect(screen.getByTestId("count")).toBeInTheDocument();
            expect(screen.getByText("Draft")).toBeInTheDocument();
        });

        it("applies pill style when requested", () => {
            render(<EnumBadgeElement code="DRAFT" values={statusValues} pill />);
            expect(screen.getByText("Draft").closest(".badge")).toHaveClass("rounded-pill");
        });
    });

    describe("Tooltip", () => {
        it("wraps the label in a tooltip trigger when a description is configured", () => {
            render(<EnumBadgeElement code="IN_PROGRESS" values={statusValues} />);
            expect(screen.getByText("In progress")).toBeInTheDocument();
            expect(document.querySelector(".info-tooltip-element")).toBeInTheDocument();
        });

        it("does not render a tooltip when no description is configured", () => {
            render(<EnumBadgeElement code="DRAFT" values={statusValues} />);
            expect(document.querySelector(".info-tooltip-element")).not.toBeInTheDocument();
        });

        it("does not render a tooltip when showTooltip is false", () => {
            render(<EnumBadgeElement code="IN_PROGRESS" values={statusValues} showTooltip={false} />);
            expect(document.querySelector(".info-tooltip-element")).not.toBeInTheDocument();
        });
    });
});
