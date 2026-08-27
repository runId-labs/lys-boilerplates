import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import ButtonElement from "./index";

describe("ButtonElement", () => {
    describe("Rendering", () => {
        it("renders children correctly", () => {
            render(<ButtonElement>Click me</ButtonElement>);
            expect(screen.getByRole("button")).toHaveTextContent("Click me");
        });

        it("renders with default variant (primary)", () => {
            render(<ButtonElement>Button</ButtonElement>);
            const button = screen.getByRole("button");
            expect(button).toHaveClass("btn-primary");
        });

        it("renders with specified variant", () => {
            render(<ButtonElement variant="danger">Button</ButtonElement>);
            const button = screen.getByRole("button");
            expect(button).toHaveClass("btn-danger");
        });

        it("renders with outline variant", () => {
            render(<ButtonElement variant="outline-primary">Button</ButtonElement>);
            const button = screen.getByRole("button");
            expect(button).toHaveClass("btn-outline-primary");
        });

        it("renders with specified size", () => {
            render(<ButtonElement size="lg">Button</ButtonElement>);
            const button = screen.getByRole("button");
            expect(button).toHaveClass("btn-lg");
        });

        it("renders with custom className", () => {
            render(<ButtonElement className="custom-class">Button</ButtonElement>);
            const button = screen.getByRole("button");
            expect(button).toHaveClass("custom-class");
            expect(button).toHaveClass("button-element");
        });
    });

    describe("Loading state", () => {
        it("shows spinner when isLoading is true", () => {
            render(<ButtonElement isLoading>Loading</ButtonElement>);
            // Spinner has aria-hidden="true", so we query by class
            expect(document.querySelector(".spinner-border")).toBeInTheDocument();
        });

        it("disables button when isLoading is true", () => {
            render(<ButtonElement isLoading>Loading</ButtonElement>);
            expect(screen.getByRole("button")).toBeDisabled();
        });

        it("hides left icon when loading", () => {
            render(
                <ButtonElement isLoading leftIcon={<span data-testid="left-icon">L</span>}>
                    Button
                </ButtonElement>
            );
            expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
        });

        it("hides right icon when loading", () => {
            render(
                <ButtonElement isLoading rightIcon={<span data-testid="right-icon">R</span>}>
                    Button
                </ButtonElement>
            );
            expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
        });
    });

    describe("Icons", () => {
        it("renders left icon", () => {
            render(
                <ButtonElement leftIcon={<span data-testid="left-icon">L</span>}>
                    Button
                </ButtonElement>
            );
            expect(screen.getByTestId("left-icon")).toBeInTheDocument();
        });

        it("renders right icon", () => {
            render(
                <ButtonElement rightIcon={<span data-testid="right-icon">R</span>}>
                    Button
                </ButtonElement>
            );
            expect(screen.getByTestId("right-icon")).toBeInTheDocument();
        });

        it("renders both icons", () => {
            render(
                <ButtonElement
                    leftIcon={<span data-testid="left-icon">L</span>}
                    rightIcon={<span data-testid="right-icon">R</span>}
                >
                    Button
                </ButtonElement>
            );
            expect(screen.getByTestId("left-icon")).toBeInTheDocument();
            expect(screen.getByTestId("right-icon")).toBeInTheDocument();
        });
    });

    describe("Full width", () => {
        it("applies full width class when fullWidth is true", () => {
            render(<ButtonElement fullWidth>Button</ButtonElement>);
            expect(screen.getByRole("button")).toHaveClass("w-100");
        });

        it("does not apply full width class by default", () => {
            render(<ButtonElement>Button</ButtonElement>);
            expect(screen.getByRole("button")).not.toHaveClass("w-100");
        });
    });

    describe("Disabled state", () => {
        it("disables button when disabled prop is true", () => {
            render(<ButtonElement disabled>Button</ButtonElement>);
            expect(screen.getByRole("button")).toBeDisabled();
        });

        it("is not disabled by default", () => {
            render(<ButtonElement>Button</ButtonElement>);
            expect(screen.getByRole("button")).not.toBeDisabled();
        });
    });

    describe("Events", () => {
        it("calls onClick handler when clicked", () => {
            const handleClick = vi.fn();
            render(<ButtonElement onClick={handleClick}>Button</ButtonElement>);
            fireEvent.click(screen.getByRole("button"));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("does not call onClick when disabled", () => {
            const handleClick = vi.fn();
            render(<ButtonElement onClick={handleClick} disabled>Button</ButtonElement>);
            fireEvent.click(screen.getByRole("button"));
            expect(handleClick).not.toHaveBeenCalled();
        });

        it("does not call onClick when loading", () => {
            const handleClick = vi.fn();
            render(<ButtonElement onClick={handleClick} isLoading>Button</ButtonElement>);
            fireEvent.click(screen.getByRole("button"));
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe("Button type", () => {
        it("defaults to button type", () => {
            render(<ButtonElement>Button</ButtonElement>);
            expect(screen.getByRole("button")).toHaveAttribute("type", "button");
        });

        it("can be set to submit type", () => {
            render(<ButtonElement type="submit">Submit</ButtonElement>);
            expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
        });
    });

    describe("Ref forwarding", () => {
        it("forwards ref to button element", () => {
            const ref = vi.fn();
            render(<ButtonElement ref={ref}>Button</ButtonElement>);
            expect(ref).toHaveBeenCalled();
            expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
        });
    });
});
