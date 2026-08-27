import {describe, it, expect, vi} from "vitest";
import {screen, fireEvent} from "@testing-library/react";
import renderWithIntl from "@/test/utils";
import InputElement from "./index";

describe("InputElement", () => {
    describe("Rendering", () => {
        it("renders with label", () => {
            renderWithIntl(<InputElement id="test-input" label="Test Label" />);
            expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
        });

        it("renders input with correct id", () => {
            renderWithIntl(<InputElement id="test-input" label="Label" />);
            expect(screen.getByRole("textbox")).toHaveAttribute("id", "test-input");
        });

        it("renders with value", () => {
            renderWithIntl(<InputElement id="test" label="Label" value="test value" onChange={() => {}} />);
            expect(screen.getByRole("textbox")).toHaveValue("test value");
        });

        it("renders with placeholder", () => {
            renderWithIntl(<InputElement id="test" label="Label" placeholder="Enter text" />);
            expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
        });
    });

    describe("Input types", () => {
        it("renders text input by default", () => {
            renderWithIntl(<InputElement id="test" label="Label" />);
            expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
        });

        it("renders email input", () => {
            renderWithIntl(<InputElement id="test" label="Email" type="email" />);
            expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
        });

        it("renders password input", () => {
            renderWithIntl(<InputElement id="test" label="Password" type="password" />);
            // Password inputs don't have textbox role
            const input = document.getElementById("test");
            expect(input).toHaveAttribute("type", "password");
        });

        it("renders textarea", () => {
            renderWithIntl(<InputElement id="test" label="Description" as="textarea" />);
            expect(screen.getByRole("textbox").tagName).toBe("TEXTAREA");
        });
    });

    describe("States", () => {
        it("renders disabled input", () => {
            renderWithIntl(<InputElement id="test" label="Label" disabled />);
            expect(screen.getByRole("textbox")).toBeDisabled();
        });

        it("renders required input", () => {
            renderWithIntl(<InputElement id="test" label="Label" required />);
            expect(screen.getByRole("textbox")).toBeRequired();
        });

        it("shows error message", () => {
            renderWithIntl(<InputElement id="test" label="Label" error="This field is required" />);
            expect(screen.getByText("This field is required")).toBeInTheDocument();
        });

        it("shows helper text", () => {
            renderWithIntl(<InputElement id="test" label="Label" helperText="Enter your name" />);
            expect(screen.getByText("Enter your name")).toBeInTheDocument();
        });
    });

    describe("Clear button", () => {
        it("does not show clear button by default", () => {
            renderWithIntl(<InputElement id="test" label="Label" value="text" onChange={() => {}} />);
            expect(screen.queryByLabelText("Clear input")).not.toBeInTheDocument();
        });

        it("shows clear button when enabled and has value", () => {
            renderWithIntl(
                <InputElement
                    id="test"
                    label="Label"
                    value="text"
                    showClearButton
                    onClear={() => {}}
                    onChange={() => {}}
                />
            );
            expect(screen.getByLabelText("Clear input")).toBeInTheDocument();
        });

        it("does not show clear button when empty", () => {
            renderWithIntl(
                <InputElement
                    id="test"
                    label="Label"
                    value=""
                    showClearButton
                    onClear={() => {}}
                    onChange={() => {}}
                />
            );
            expect(screen.queryByLabelText("Clear input")).not.toBeInTheDocument();
        });

        it("does not show clear button when disabled", () => {
            renderWithIntl(
                <InputElement
                    id="test"
                    label="Label"
                    value="text"
                    showClearButton
                    disabled
                    onClear={() => {}}
                    onChange={() => {}}
                />
            );
            expect(screen.queryByLabelText("Clear input")).not.toBeInTheDocument();
        });

        it("calls onClear when clear button clicked", () => {
            const handleClear = vi.fn();
            renderWithIntl(
                <InputElement
                    id="test"
                    label="Label"
                    value="text"
                    showClearButton
                    onClear={handleClear}
                    onChange={() => {}}
                />
            );
            fireEvent.click(screen.getByLabelText("Clear input"));
            expect(handleClear).toHaveBeenCalledTimes(1);
        });

        it("calls onClear on Enter key", () => {
            const handleClear = vi.fn();
            renderWithIntl(
                <InputElement
                    id="test"
                    label="Label"
                    value="text"
                    showClearButton
                    onClear={handleClear}
                    onChange={() => {}}
                />
            );
            fireEvent.keyDown(screen.getByLabelText("Clear input"), {key: "Enter"});
            expect(handleClear).toHaveBeenCalledTimes(1);
        });
    });

    describe("Character count", () => {
        it("shows character count when enabled", () => {
            renderWithIntl(
                <InputElement
                    id="test"
                    label="Label"
                    value="hello"
                    maxLength={100}
                    showCharacterCount
                    onChange={() => {}}
                />
            );
            expect(screen.getByText("5/100")).toBeInTheDocument();
        });

        it("combines character count with helper text", () => {
            renderWithIntl(
                <InputElement
                    id="test"
                    label="Label"
                    value="hello"
                    maxLength={100}
                    showCharacterCount
                    helperText="Enter your bio"
                    onChange={() => {}}
                />
            );
            expect(screen.getByText("5/100 • Enter your bio")).toBeInTheDocument();
        });
    });

    describe("Icons", () => {
        it("renders left icon", () => {
            renderWithIntl(
                <InputElement
                    id="test"
                    label="Label"
                    leftIcon={<span data-testid="left-icon">L</span>}
                />
            );
            expect(screen.getByTestId("left-icon")).toBeInTheDocument();
        });

        it("renders right icon", () => {
            renderWithIntl(
                <InputElement
                    id="test"
                    label="Label"
                    rightIcon={<span data-testid="right-icon">R</span>}
                />
            );
            expect(screen.getByTestId("right-icon")).toBeInTheDocument();
        });
    });

    describe("Events", () => {
        it("calls onChange when typing", () => {
            const handleChange = vi.fn();
            renderWithIntl(<InputElement id="test" label="Label" onChange={handleChange} />);
            fireEvent.change(screen.getByRole("textbox"), {target: {value: "new value"}});
            expect(handleChange).toHaveBeenCalled();
        });
    });

    describe("MaxLength", () => {
        it("sets maxLength attribute", () => {
            renderWithIntl(<InputElement id="test" label="Label" maxLength={50} />);
            expect(screen.getByRole("textbox")).toHaveAttribute("maxLength", "50");
        });
    });

    describe("Ref forwarding", () => {
        it("forwards ref to input element", () => {
            const ref = vi.fn();
            renderWithIntl(<InputElement id="test" label="Label" ref={ref} />);
            expect(ref).toHaveBeenCalled();
        });
    });
});
