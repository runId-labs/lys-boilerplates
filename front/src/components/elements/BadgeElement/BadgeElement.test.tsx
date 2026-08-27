import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import BadgeElement from "./index";

describe("BadgeElement", () => {
    describe("Rendering", () => {
        it("renders children correctly", () => {
            render(<BadgeElement>Badge text</BadgeElement>);
            expect(screen.getByText("Badge text")).toBeInTheDocument();
        });

        it("renders with default bg (primary)", () => {
            render(<BadgeElement>Badge</BadgeElement>);
            const badge = screen.getByText("Badge");
            expect(badge).toHaveClass("bg-primary");
        });

        it("renders with specified bg variant", () => {
            render(<BadgeElement bg="danger">Badge</BadgeElement>);
            const badge = screen.getByText("Badge");
            expect(badge).toHaveClass("bg-danger");
        });

        it("renders with pill style", () => {
            render(<BadgeElement pill>Badge</BadgeElement>);
            const badge = screen.getByText("Badge");
            expect(badge).toHaveClass("rounded-pill");
        });

        it("renders with custom className", () => {
            render(<BadgeElement className="custom-class">Badge</BadgeElement>);
            const badge = screen.getByText("Badge");
            expect(badge).toHaveClass("custom-class");
        });
    });

    describe("Variants", () => {
        const variants = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"] as const;

        variants.forEach((variant) => {
            it(`renders with ${variant} variant`, () => {
                render(<BadgeElement bg={variant}>Badge</BadgeElement>);
                const badge = screen.getByText("Badge");
                expect(badge).toHaveClass(`bg-${variant}`);
            });
        });
    });
});
