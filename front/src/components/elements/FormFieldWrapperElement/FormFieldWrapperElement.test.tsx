import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import FormFieldWrapperElement from "./index";

describe("FormFieldWrapperElement", () => {
    describe("Standard label rendering", () => {
        it("renders label correctly", () => {
            render(
                <FormFieldWrapperElement id="test-input" label="Test Label">
                    <input id="test-input" />
                </FormFieldWrapperElement>
            );
            expect(screen.getByText("Test Label")).toBeInTheDocument();
        });

        it("renders children", () => {
            render(
                <FormFieldWrapperElement id="test-input" label="Label">
                    <input id="test-input" data-testid="test-input" />
                </FormFieldWrapperElement>
            );
            expect(screen.getByTestId("test-input")).toBeInTheDocument();
        });

        it("label has correct htmlFor attribute", () => {
            render(
                <FormFieldWrapperElement id="field-id" label="Label">
                    <input id="field-id" />
                </FormFieldWrapperElement>
            );
            const label = screen.getByText("Label");
            expect(label).toHaveAttribute("for", "field-id");
        });

        it("adds asterisk when required", () => {
            render(
                <FormFieldWrapperElement id="test-input" label="Required Field" required>
                    <input id="test-input" />
                </FormFieldWrapperElement>
            );
            expect(screen.getByText("Required Field *")).toBeInTheDocument();
        });
    });

    describe("Floating label rendering", () => {
        it("renders with floating label", () => {
            render(
                <FormFieldWrapperElement id="test-input" label="Floating Label" isFloatingLabel>
                    <input id="test-input" />
                </FormFieldWrapperElement>
            );
            expect(screen.getByText("Floating Label")).toBeInTheDocument();
        });

        it("renders floating label after children", () => {
            const {container} = render(
                <FormFieldWrapperElement id="test-input" label="Floating" isFloatingLabel>
                    <input id="test-input" />
                </FormFieldWrapperElement>
            );
            expect(container.querySelector(".form-floating")).toBeInTheDocument();
        });
    });

    describe("Error state", () => {
        it("displays error message", () => {
            render(
                <FormFieldWrapperElement id="test-input" label="Field" error="Field is required">
                    <input id="test-input" />
                </FormFieldWrapperElement>
            );
            expect(screen.getByText("Field is required")).toBeInTheDocument();
        });

        it("adds is-invalid class to child when error", () => {
            const {container} = render(
                <FormFieldWrapperElement id="test-input" label="Field" error="Error">
                    <input id="test-input" className="form-control" />
                </FormFieldWrapperElement>
            );
            expect(container.querySelector(".is-invalid")).toBeInTheDocument();
        });

        it("sets aria-invalid on child when error", () => {
            render(
                <FormFieldWrapperElement id="test-input" label="Field" error="Error">
                    <input id="test-input" data-testid="input" />
                </FormFieldWrapperElement>
            );
            expect(screen.getByTestId("input")).toHaveAttribute("aria-invalid", "true");
        });

        it("sets aria-describedby on child for error", () => {
            render(
                <FormFieldWrapperElement id="test-input" label="Field" error="Error message">
                    <input id="test-input" data-testid="input" />
                </FormFieldWrapperElement>
            );
            expect(screen.getByTestId("input")).toHaveAttribute("aria-describedby", "test-input-error");
        });
    });

    describe("Helper text", () => {
        it("displays helper text", () => {
            render(
                <FormFieldWrapperElement id="test-input" label="Field" helperText="Helper text here">
                    <input id="test-input" />
                </FormFieldWrapperElement>
            );
            expect(screen.getByText("Helper text here")).toBeInTheDocument();
        });

        it("hides helper text when error is shown", () => {
            render(
                <FormFieldWrapperElement
                    id="test-input"
                    label="Field"
                    helperText="Helper"
                    error="Error"
                >
                    <input id="test-input" />
                </FormFieldWrapperElement>
            );
            expect(screen.queryByText("Helper")).not.toBeInTheDocument();
            expect(screen.getByText("Error")).toBeInTheDocument();
        });

        it("sets aria-describedby for helper text", () => {
            render(
                <FormFieldWrapperElement id="test-input" label="Field" helperText="Helper">
                    <input id="test-input" data-testid="input" />
                </FormFieldWrapperElement>
            );
            expect(screen.getByTestId("input")).toHaveAttribute("aria-describedby", "test-input-helper");
        });
    });

    describe("Required state", () => {
        it("sets aria-required on child when required", () => {
            render(
                <FormFieldWrapperElement id="test-input" label="Field" required>
                    <input id="test-input" data-testid="input" />
                </FormFieldWrapperElement>
            );
            expect(screen.getByTestId("input")).toHaveAttribute("aria-required", "true");
        });
    });

    describe("Custom className", () => {
        it("applies custom className", () => {
            const {container} = render(
                <FormFieldWrapperElement id="test-input" label="Field" className="custom-class">
                    <input id="test-input" />
                </FormFieldWrapperElement>
            );
            expect(container.querySelector(".custom-class")).toBeInTheDocument();
        });

        it("includes base className", () => {
            const {container} = render(
                <FormFieldWrapperElement id="test-input" label="Field">
                    <input id="test-input" />
                </FormFieldWrapperElement>
            );
            expect(container.querySelector(".form-field-wrapper-element")).toBeInTheDocument();
        });
    });
});
